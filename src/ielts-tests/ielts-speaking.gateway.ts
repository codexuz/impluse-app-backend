import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { IeltsSpeakingService } from "./ielts-speaking.service.js";
import {
  IeltsSpeakingRealtimeService,
  RealtimeTool,
} from "./ielts-speaking-realtime.service.js";
import {
  IeltsSpeakingAttempt,
  SpeakingAttemptStatus,
} from "./entities/ielts-speaking-attempt.entity.js";
import { IeltsSpeaking } from "./entities/ielts-speaking.entity.js";
import {
  IeltsSpeakingPart,
  SpeakingPart,
} from "./entities/ielts-speaking-part.entity.js";
import {
  EndSpeakingDto,
  MuteSpeakingDto,
  SpeakingAudioChunkDto,
  StartSpeakingSessionDto,
} from "./dto/speaking-session.dto.js";

interface AuthenticatedSocket extends Socket {
  user?: { id: string; username: string; roles: string[] };
}

// Hard cap on a speaking session (15 minutes is well beyond a real exam).
const SESSION_MAX_MS = 15 * 60 * 1000;

type Phase = "part1" | "part2_prep" | "part2_speak" | "part3" | "done";

interface TranscriptTurn {
  role: "examiner" | "candidate";
  text: string;
  at: string;
}

interface ActiveSession {
  userId: string;
  socketId: string;
  attemptId: string;
  speakingId: string;
  startedAt: number;
  muted: boolean;
  phase: Phase;
  limitTimer: NodeJS.Timeout;
  prepTimer?: NodeJS.Timeout;
  speakTimer?: NodeJS.Timeout;
  part2?: { prepSeconds: number; speakSeconds: number };
  transcript: TranscriptTurn[];
}

const BEGIN_PART2_TOOL: RealtimeTool = {
  type: "function",
  name: "begin_part2_long_turn",
  description:
    "Call this IMMEDIATELY AFTER you have read out the full Part 2 cue card and " +
    "told the candidate they have one minute to prepare. It starts the official " +
    "1-minute preparation timer followed by the 2-minute speaking window. After " +
    "calling it, stay completely silent — the system tells you when to prompt the " +
    "candidate to begin and when their time is up.",
  parameters: { type: "object", properties: {}, additionalProperties: false },
};

@WebSocketGateway({
  namespace: "/ielts-speaking",
  cors: { origin: "*", credentials: true },
  transports: ["websocket", "polling"],
})
export class IeltsSpeakingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(IeltsSpeakingGateway.name);

  // userId -> socketId (one active socket per user on this namespace)
  private readonly userSockets = new Map<string, string>();
  // sessionId (= attemptId) -> active session state
  private readonly sessions = new Map<string, ActiveSession>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly speakingService: IeltsSpeakingService,
    private readonly realtime: IeltsSpeakingRealtimeService,
    @InjectModel(IeltsSpeakingAttempt)
    private readonly attemptModel: typeof IeltsSpeakingAttempt,
  ) {}

  afterInit() {
    this.logger.log("IELTS Speaking Gateway initialized on /ielts-speaking");
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace("Bearer ", "");
      if (!token) {
        client.emit("speaking:error", { message: "Authentication required" });
        client.disconnect();
        return;
      }
      const payload = await this.jwtService.verifyAsync(token);
      client.user = {
        id: payload.sub || payload.user_id,
        username: payload.username,
        roles: payload.roles ?? [],
      };
      this.userSockets.set(client.user.id, client.id);
      await client.join(`user:${client.user.id}`);
      client.emit("speaking:ready", { user_id: client.user.id });
    } catch (error: any) {
      this.logger.error(`Auth failed for ${client.id}: ${error?.message}`);
      client.emit("speaking:error", { message: "Invalid token" });
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    if (!client.user) return;
    this.userSockets.delete(client.user.id);
    for (const [sessionId, s] of this.sessions) {
      if (s.socketId === client.id) {
        await this.teardown(sessionId, "disconnected", SpeakingAttemptStatus.ABANDONED);
      }
    }
  }

  // ==================== Start ====================

  @SubscribeMessage("speaking:start")
  async handleStart(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: StartSpeakingSessionDto,
  ) {
    if (!client.user) return;

    if (!this.realtime.isEnabled()) {
      client.emit("speaking:error", {
        message: "AI speaking is not configured.",
      });
      return;
    }

    let speaking: IeltsSpeaking;
    try {
      speaking = await this.speakingService.findSpeakingById(data.speaking_id);
    } catch {
      client.emit("speaking:error", { message: "Speaking topic not found." });
      return;
    }

    const parts = [...(speaking.parts ?? [])].sort(
      (a, b) => a.order - b.order,
    );
    if (parts.length === 0) {
      client.emit("speaking:error", {
        message: "This speaking topic has no parts configured.",
      });
      return;
    }

    const part2 = parts.find((p) => p.part === SpeakingPart.PART_2);

    const attempt = await this.attemptModel.create({
      user_id: client.user.id,
      speaking_id: speaking.id,
      status: SpeakingAttemptStatus.IN_PROGRESS,
      started_at: new Date(),
    } as any);
    const sessionId = attempt.id;

    const limitTimer = setTimeout(() => {
      void this.teardown(sessionId, "time_limit", SpeakingAttemptStatus.COMPLETED);
    }, SESSION_MAX_MS);

    const state: ActiveSession = {
      userId: client.user.id,
      socketId: client.id,
      attemptId: attempt.id,
      speakingId: speaking.id,
      startedAt: Date.now(),
      muted: false,
      phase: "part1",
      limitTimer,
      part2: part2
        ? { prepSeconds: part2.prep_seconds, speakSeconds: part2.speak_seconds }
        : undefined,
      transcript: [],
    };
    this.sessions.set(sessionId, state);

    const instructions = this.buildInstructions(speaking, parts);
    const tools = part2 ? [BEGIN_PART2_TOOL] : [];

    try {
      await this.realtime.startSession(
        sessionId,
        { instructions, voice: data.voice ?? speaking.voice, tools },
        {
          onAudioDelta: (audio) =>
            client.emit("speaking:audio", { session_id: sessionId, audio }),
          onAiTranscriptDelta: (text) =>
            client.emit("speaking:ai-transcript", { session_id: sessionId, text }),
          onAiTranscriptDone: (text) =>
            this.recordTurn(sessionId, "examiner", text),
          onUserTranscript: (text) => {
            this.recordTurn(sessionId, "candidate", text);
            client.emit("speaking:user-transcript", {
              session_id: sessionId,
              text,
            });
          },
          onSpeechStarted: () =>
            client.emit("speaking:speech-started", { session_id: sessionId }),
          onResponseDone: () =>
            client.emit("speaking:response-done", { session_id: sessionId }),
          onFunctionCall: (name, callItemId) =>
            this.handleFunctionCall(sessionId, name, callItemId),
          onError: (message) =>
            client.emit("speaking:error", { session_id: sessionId, message }),
          onClosed: () =>
            client.emit("speaking:ended", {
              session_id: sessionId,
              reason: "session_closed",
            }),
        },
      );

      client.emit("speaking:started", {
        session_id: sessionId,
        speaking_id: speaking.id,
        title: speaking.title,
      });

      // Kick off the exam: greet the candidate and begin Part 1.
      this.realtime.respond(sessionId);
    } catch (err: any) {
      clearTimeout(limitTimer);
      this.realtime.endSession(sessionId);
      this.sessions.delete(sessionId);
      await attempt
        .update({ status: SpeakingAttemptStatus.ABANDONED, finished_at: new Date() })
        .catch(() => undefined);
      client.emit("speaking:error", {
        session_id: sessionId,
        message: err?.message ?? "Failed to start speaking session",
      });
    }
  }

  // ==================== Part 2 timing (tool-driven) ====================

  private handleFunctionCall(sessionId: string, name: string, callItemId: string) {
    const s = this.sessions.get(sessionId);
    if (!s) return;

    if (name !== "begin_part2_long_turn") {
      // Unknown tool — acknowledge so the model isn't left waiting.
      this.realtime.sendFunctionOutput(sessionId, callItemId, { status: "ignored" });
      return;
    }
    // Guard against duplicate triggers.
    if (s.phase !== "part1" || !s.part2) {
      this.realtime.sendFunctionOutput(sessionId, callItemId, { status: "already_started" });
      return;
    }

    this.realtime.sendFunctionOutput(sessionId, callItemId, { status: "prep_started" });

    // Examiner must stay silent through prep and the long turn.
    this.realtime.setAutoResponse(sessionId, false);
    s.phase = "part2_prep";

    const prepMs = s.part2.prepSeconds * 1000;
    const speakSeconds = s.part2.speakSeconds;

    this.emitToUser(s, "speaking:prep-started", {
      session_id: sessionId,
      seconds: s.part2.prepSeconds,
    });

    s.prepTimer = setTimeout(() => {
      const cur = this.sessions.get(sessionId);
      if (!cur || cur.phase !== "part2_prep") return;
      cur.phase = "part2_speak";

      this.emitToUser(cur, "speaking:speaking-started", {
        session_id: sessionId,
        seconds: speakSeconds,
      });
      // One scripted prompt, then the examiner stays silent (auto-response off).
      this.realtime.respond(
        sessionId,
        "Say exactly: 'Alright, your preparation time is over. Please begin speaking now.' " +
          "Then stop talking and listen silently. Do NOT interrupt the candidate.",
      );

      cur.speakTimer = setTimeout(() => {
        const cur2 = this.sessions.get(sessionId);
        if (!cur2 || cur2.phase !== "part2_speak") return;
        cur2.phase = "part3";

        this.emitToUser(cur2, "speaking:speaking-ended", { session_id: sessionId });
        // Re-enable normal turn-taking for the Part 3 discussion.
        this.realtime.setAutoResponse(sessionId, true);
        this.realtime.respond(
          sessionId,
          "The candidate's two minutes are finished. If they are still speaking, " +
            "gently stop them and thank them. Then move on to Part 3 and ask your " +
            "first Part 3 discussion question.",
        );
      }, speakSeconds * 1000);
    }, prepMs);
  }

  // ==================== Audio / mute / end ====================

  @SubscribeMessage("speaking:audio")
  handleAudio(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: SpeakingAudioChunkDto,
  ) {
    if (!client.user) return;
    const s = this.sessions.get(data.session_id);
    if (!s || s.userId !== client.user.id) return;
    // Drop mic audio while muted or during the silent Part 2 prep window.
    if (s.muted || s.phase === "part2_prep") return;
    this.realtime.appendAudio(data.session_id, data.audio);
  }

  @SubscribeMessage("speaking:mute")
  handleMute(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: MuteSpeakingDto,
  ) {
    if (!client.user) return;
    const s = this.sessions.get(data.session_id);
    if (!s || s.userId !== client.user.id) return;
    s.muted = data.muted;
    if (data.muted) this.realtime.clearInput(data.session_id);
  }

  @SubscribeMessage("speaking:end")
  async handleEnd(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: EndSpeakingDto,
  ) {
    if (!client.user) return;
    const s = this.sessions.get(data.session_id);
    if (!s || s.userId !== client.user.id) return;
    await this.teardown(data.session_id, "user_ended", SpeakingAttemptStatus.COMPLETED);
  }

  // ==================== Helpers ====================

  private recordTurn(
    sessionId: string,
    role: "examiner" | "candidate",
    text: string,
  ) {
    const s = this.sessions.get(sessionId);
    if (!s) return;
    const trimmed = text?.trim();
    if (!trimmed) return;
    s.transcript.push({ role, text: trimmed, at: new Date().toISOString() });
  }

  private emitToUser(s: ActiveSession, event: string, payload: unknown) {
    this.server.to(`user:${s.userId}`).emit(event, payload);
  }

  private async teardown(
    sessionId: string,
    reason: string,
    status: SpeakingAttemptStatus,
  ) {
    const s = this.sessions.get(sessionId);
    if (!s) return;
    this.sessions.delete(sessionId);

    clearTimeout(s.limitTimer);
    if (s.prepTimer) clearTimeout(s.prepTimer);
    if (s.speakTimer) clearTimeout(s.speakTimer);
    this.realtime.endSession(sessionId);

    const durationSeconds = Math.max(0, Math.round((Date.now() - s.startedAt) / 1000));
    await this.attemptModel
      .update(
        {
          status,
          finished_at: new Date(),
          duration_seconds: durationSeconds,
          transcript: s.transcript,
        },
        { where: { id: s.attemptId } },
      )
      .catch((e) => this.logger.error(`Failed to persist attempt: ${e?.message}`));

    this.server.to(`user:${s.userId}`).emit("speaking:ended", {
      session_id: sessionId,
      reason,
    });
  }

  /** Build the examiner persona + the full exam script from the topic. */
  private buildInstructions(
    speaking: IeltsSpeaking,
    parts: IeltsSpeakingPart[],
  ): string {
    const part1s = parts.filter((p) => p.part === SpeakingPart.PART_1);
    const part2 = parts.find((p) => p.part === SpeakingPart.PART_2);
    const part3s = parts.filter((p) => p.part === SpeakingPart.PART_3);

    const listQuestions = (ps: IeltsSpeakingPart[]): string => {
      const lines: string[] = [];
      for (const p of ps) {
        if (p.title) lines.push(`  Topic: ${p.title}`);
        const qs = [...(p.questions ?? [])].sort((a, b) => a.order - b.order);
        for (const q of qs) lines.push(`   - ${q.question_text}`);
      }
      return lines.length ? lines.join("\n") : "   (improvise suitable questions)";
    };

    const sections: string[] = [];

    sections.push(
      `You are a professional, friendly IELTS Speaking examiner conducting a live spoken exam. ` +
        `Speak clearly at a natural pace with a warm, encouraging but neutral examiner tone. ` +
        `Topic of this exam: "${speaking.title}".`,
    );

    sections.push(`# Golden rules
- Ask ONE question at a time, then wait and listen. Never read out a whole list.
- Keep your own turns short. The candidate should do almost all of the talking.
- React briefly and naturally ("Thank you.", "I see.", "That's interesting.") then continue.
- Do NOT teach, correct grammar, or give feedback during the exam — you are assessing, not tutoring.
- Stay strictly within the questions/topics provided below; you may add small natural follow-ups.
- Use only the audio modality (speak your turns).`);

    sections.push(`# Start
Greet the candidate briefly, introduce yourself as their examiner, and say you'll begin with some questions about familiar topics. Then ask the FIRST Part 1 question. Do not list the questions.`);

    sections.push(`# Part 1 — Interview (ask one at a time)
${listQuestions(part1s)}
When you have covered the Part 1 questions, move on to Part 2.`);

    if (part2) {
      const bullets = [...(part2.questions ?? [])].sort((a, b) => a.order - b.order);
      const cue =
        part2.cue_card ||
        (part2.title ? `Describe: ${part2.title}` : "Describe a topic of your choice.");
      const bulletText = bullets.length
        ? "You should say:\n" + bullets.map((b) => `   - ${b.question_text}`).join("\n")
        : "";
      sections.push(`# Part 2 — Long turn (cue card)
Introduce Part 2: explain that you'll give them a topic to talk about for one to two minutes, and that they have one minute to prepare and can make notes. Then read the cue card below clearly:

   "${cue}"
${bulletText}

Then tell them: "You have one minute to prepare. Your time starts now."
IMPORTANT: As soon as you have said that, CALL the function "begin_part2_long_turn" and then STAY SILENT. The system manages the 1-minute preparation and 2-minute speaking timers and will tell you exactly when to prompt the candidate to begin and when to stop. Do not announce the timing yourself beyond the cue card introduction.`);
    }

    if (part3s.length) {
      sections.push(`# Part 3 — Discussion (ask one at a time)
${listQuestions(part3s)}
Discuss these more abstract questions, asking one at a time with brief natural follow-ups.`);
    }

    sections.push(`# Finish
When the questions are done, say "Thank you, that is the end of the speaking test." and stop.`);

    return sections.join("\n\n");
  }

  /** IDs of users currently connected to this namespace. */
  getOnlineUserIds(): string[] {
    return Array.from(this.userSockets.keys());
  }
}
