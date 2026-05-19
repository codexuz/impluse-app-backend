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
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from "uuid";
import { CallLogService } from "./call-log.service.js";
import { OpenAiRealtimeService } from "./openai-realtime.service.js";
import { StudentProfileService } from "../student_profiles/student-profile.service.js";
import {
  CallAnswerDto,
  HangupDto,
  IceCandidateDto,
  InviteCallDto,
  SdpDto,
} from "./dto/signaling.dto.js";
import {
  AiAudioChunkDto,
  AiCommitDto,
  EndAiCallDto,
  StartAiCallDto,
} from "./dto/ai-call.dto.js";

interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    username: string;
    roles: string[];
  };
}

// Cost in coins charged to the student before an AI call starts.
const AI_CALL_COST_COINS = 1000;
// Hard cap on AI call duration (15 minutes).
const AI_CALL_MAX_MS = 15 * 60 * 1000;

interface ActiveAiCall {
  userId: string;
  socketId: string;
  // Auto-end timer that enforces the 15-minute limit.
  limitTimer: NodeJS.Timeout;
}

interface ActiveP2PCall {
  id: string;
  callerId: string;
  calleeId: string;
  callerSocketId: string;
  calleeSocketId?: string;
  accepted: boolean;
}

@WebSocketGateway({
  namespace: "/call",
  cors: { origin: "*", credentials: true },
  transports: ["websocket", "polling"],
})
export class AudioCallGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(AudioCallGateway.name);

  // userId -> socketId (one active socket per user on the /call namespace)
  private readonly userSockets = new Map<string, string>();
  // callId -> p2p call state
  private readonly p2pCalls = new Map<string, ActiveP2PCall>();
  // callId -> AI call state owned by a socket
  private readonly aiCalls = new Map<string, ActiveAiCall>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly callLogService: CallLogService,
    private readonly realtime: OpenAiRealtimeService,
    private readonly studentProfileService: StudentProfileService,
  ) {}

  afterInit() {
    this.logger.log("Audio Call Gateway initialized on namespace /call");
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace("Bearer ", "");

      if (!token) {
        client.emit("call:error", { message: "Authentication required" });
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

      this.logger.log(
        `User ${client.user.username} connected to /call: ${client.id}`,
      );
      client.emit("call:ready", { user_id: client.user.id });
    } catch (error: any) {
      this.logger.error(`Auth failed for ${client.id}: ${error?.message}`);
      client.emit("call:error", { message: "Invalid token" });
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    if (!client.user) return;
    const userId = client.user.id;
    this.userSockets.delete(userId);

    // Tear down any p2p calls this user was part of
    for (const [callId, call] of this.p2pCalls) {
      if (call.callerId === userId || call.calleeId === userId) {
        const otherId =
          call.callerId === userId ? call.calleeId : call.callerId;
        this.server
          .to(`user:${otherId}`)
          .emit("call:ended", { call_id: callId, reason: "peer_disconnected" });
        await this.callLogService.markEnded(
          callId,
          call.accepted ? "completed" : "cancelled",
          "peer_disconnected",
        );
        this.p2pCalls.delete(callId);
      }
    }

    // Tear down any AI call this socket owned
    for (const [callId, ai] of this.aiCalls) {
      if (ai.socketId === client.id) {
        clearTimeout(ai.limitTimer);
        this.realtime.endSession(callId);
        await this.callLogService.markEnded(callId, "completed", "disconnected");
        this.aiCalls.delete(callId);
      }
    }

    this.logger.log(`User ${client.user.username} disconnected from /call`);
  }

  // ==================== User <-> User (WebRTC signaling) ====================

  @SubscribeMessage("call:invite")
  async handleInvite(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: InviteCallDto,
  ) {
    if (!client.user) return;
    const calleeSocketId = this.userSockets.get(data.callee_id);

    const callRecord = await this.callLogService.createCall({
      kind: "p2p",
      callerId: client.user.id,
      calleeId: data.callee_id,
    });

    const call: ActiveP2PCall = {
      id: callRecord.id,
      callerId: client.user.id,
      calleeId: data.callee_id,
      callerSocketId: client.id,
      calleeSocketId,
      accepted: false,
    };
    this.p2pCalls.set(call.id, call);

    if (!calleeSocketId) {
      await this.callLogService.markEnded(call.id, "missed", "callee_offline");
      this.p2pCalls.delete(call.id);
      client.emit("call:unavailable", {
        call_id: call.id,
        callee_id: data.callee_id,
      });
      return;
    }

    client.emit("call:ringing", { call_id: call.id });
    this.server.to(`user:${data.callee_id}`).emit("call:incoming", {
      call_id: call.id,
      caller_id: client.user.id,
      caller_username: client.user.username,
    });

    // Auto-miss after 45s if not answered
    setTimeout(async () => {
      const stillRinging = this.p2pCalls.get(call.id);
      if (stillRinging && !stillRinging.accepted) {
        this.p2pCalls.delete(call.id);
        await this.callLogService.markEnded(call.id, "missed", "timeout");
        this.server
          .to(`user:${call.callerId}`)
          .emit("call:ended", { call_id: call.id, reason: "no_answer" });
        this.server
          .to(`user:${call.calleeId}`)
          .emit("call:ended", { call_id: call.id, reason: "no_answer" });
      }
    }, 45_000);
  }

  @SubscribeMessage("call:accept")
  async handleAccept(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: CallAnswerDto,
  ) {
    if (!client.user) return;
    const call = this.p2pCalls.get(data.call_id);
    if (!call || call.calleeId !== client.user.id) return;

    call.accepted = true;
    call.calleeSocketId = client.id;
    await this.callLogService.markOngoing(call.id);

    // Caller is the WebRTC offerer: tell it to create the offer now.
    this.server.to(`user:${call.callerId}`).emit("call:accepted", {
      call_id: call.id,
      callee_id: call.calleeId,
    });
  }

  @SubscribeMessage("call:reject")
  async handleReject(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: CallAnswerDto,
  ) {
    if (!client.user) return;
    const call = this.p2pCalls.get(data.call_id);
    if (!call) return;

    this.p2pCalls.delete(call.id);
    await this.callLogService.markEnded(call.id, "rejected", "rejected_by_callee");
    this.server
      .to(`user:${call.callerId}`)
      .emit("call:ended", { call_id: call.id, reason: "rejected" });
  }

  @SubscribeMessage("call:offer")
  handleOffer(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: SdpDto,
  ) {
    const call = this.p2pCalls.get(data.call_id);
    if (!call || !client.user) return;
    const targetId =
      call.callerId === client.user.id ? call.calleeId : call.callerId;
    this.server
      .to(`user:${targetId}`)
      .emit("call:offer", { call_id: data.call_id, sdp: data.sdp });
  }

  @SubscribeMessage("call:answer")
  handleAnswer(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: SdpDto,
  ) {
    const call = this.p2pCalls.get(data.call_id);
    if (!call || !client.user) return;
    const targetId =
      call.callerId === client.user.id ? call.calleeId : call.callerId;
    this.server
      .to(`user:${targetId}`)
      .emit("call:answer", { call_id: data.call_id, sdp: data.sdp });
  }

  @SubscribeMessage("call:ice-candidate")
  handleIce(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: IceCandidateDto,
  ) {
    const call = this.p2pCalls.get(data.call_id);
    if (!call || !client.user) return;
    const targetId =
      call.callerId === client.user.id ? call.calleeId : call.callerId;
    this.server.to(`user:${targetId}`).emit("call:ice-candidate", {
      call_id: data.call_id,
      candidate: data.candidate,
    });
  }

  @SubscribeMessage("call:hangup")
  async handleHangup(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: HangupDto,
  ) {
    if (!client.user) return;
    const call = this.p2pCalls.get(data.call_id);
    if (!call) return;

    const otherId =
      call.callerId === client.user.id ? call.calleeId : call.callerId;
    this.p2pCalls.delete(call.id);
    await this.callLogService.markEnded(
      call.id,
      call.accepted ? "completed" : "cancelled",
      data.reason ?? "hangup",
    );
    this.server
      .to(`user:${otherId}`)
      .emit("call:ended", { call_id: call.id, reason: "hangup" });
  }

  // ==================== User <-> AI (OpenAI Realtime) ====================

  @SubscribeMessage("ai-call:start")
  async handleAiStart(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: StartAiCallDto,
  ) {
    if (!client.user) return;

    if (!this.realtime.isEnabled()) {
      client.emit("call:error", { message: "AI calling is not configured." });
      return;
    }

    // Charge the student before the call starts. If the balance is too
    // low (or there's no profile) the call is refused with no charge.
    try {
      await this.studentProfileService.deductCoins(
        client.user.id,
        AI_CALL_COST_COINS,
      );
    } catch (err: any) {
      client.emit("call:error", {
        message:
          err?.message ??
          `You need ${AI_CALL_COST_COINS} coins to start an AI call.`,
      });
      return;
    }

    const record = await this.callLogService.createCall({
      kind: "ai",
      callerId: client.user.id,
      calleeId: null,
    });
    const callId = record.id;

    const limitTimer = setTimeout(() => {
      void this.endAiCallByLimit(callId);
    }, AI_CALL_MAX_MS);

    this.aiCalls.set(callId, {
      userId: client.user.id,
      socketId: client.id,
      limitTimer,
    });

    try {
      await this.realtime.startSession(
        callId,
        { instructions: data.instructions, voice: data.voice },
        {
          onAudioDelta: (audio) =>
            client.emit("ai-call:audio", { call_id: callId, audio }),
          onAiTranscriptDelta: (text) =>
            client.emit("ai-call:ai-transcript", { call_id: callId, text }),
          onUserTranscript: (text) =>
            client.emit("ai-call:user-transcript", { call_id: callId, text }),
          onSpeechStarted: () =>
            client.emit("ai-call:speech-started", { call_id: callId }),
          onResponseDone: () =>
            client.emit("ai-call:response-done", { call_id: callId }),
          onError: (message) =>
            client.emit("call:error", { call_id: callId, message }),
          onClosed: () =>
            client.emit("call:ended", {
              call_id: callId,
              reason: "ai_session_closed",
            }),
        },
      );

      await this.callLogService.markOngoing(callId);
      client.emit("ai-call:started", { call_id: callId });
    } catch (err: any) {
      clearTimeout(limitTimer);
      this.realtime.endSession(callId);
      this.aiCalls.delete(callId);
      // The student was charged but never got a working session — refund.
      await this.studentProfileService
        .addCoins(client.user.id, AI_CALL_COST_COINS)
        .catch((refundErr) =>
          this.logger.error(
            `Failed to refund AI call charge for user ${client.user!.id}: ${refundErr?.message}`,
          ),
        );
      await this.callLogService.markEnded(
        callId,
        "failed",
        err?.message ?? "realtime_start_failed",
      );
      client.emit("call:error", {
        call_id: callId,
        message: err?.message ?? "Failed to start AI call",
      });
    }
  }

  /** End an AI call because it hit the 15-minute time limit. */
  private async endAiCallByLimit(callId: string): Promise<void> {
    const ai = this.aiCalls.get(callId);
    if (!ai) return;

    this.realtime.endSession(callId);
    this.aiCalls.delete(callId);
    await this.callLogService.markEnded(callId, "completed", "time_limit");
    this.server.to(`user:${ai.userId}`).emit("call:ended", {
      call_id: callId,
      reason: "time_limit",
    });
  }

  @SubscribeMessage("ai-call:audio")
  handleAiAudio(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: AiAudioChunkDto,
  ) {
    if (!client.user) return;
    const ai = this.aiCalls.get(data.call_id);
    if (!ai || ai.userId !== client.user.id) return;
    this.realtime.appendAudio(data.call_id, data.audio);
  }

  @SubscribeMessage("ai-call:commit")
  handleAiCommit(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: AiCommitDto,
  ) {
    if (!client.user) return;
    const ai = this.aiCalls.get(data.call_id);
    if (!ai || ai.userId !== client.user.id) return;
    this.realtime.commitAndRespond(data.call_id);
  }

  @SubscribeMessage("ai-call:end")
  async handleAiEnd(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: EndAiCallDto,
  ) {
    if (!client.user) return;
    const ai = this.aiCalls.get(data.call_id);
    if (!ai || ai.userId !== client.user.id) return;

    clearTimeout(ai.limitTimer);
    this.realtime.endSession(data.call_id);
    this.aiCalls.delete(data.call_id);
    await this.callLogService.markEnded(data.call_id, "completed", "user_ended");
    client.emit("call:ended", { call_id: data.call_id, reason: "user_ended" });
  }
}
