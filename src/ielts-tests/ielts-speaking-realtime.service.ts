import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { OpenAIRealtimeWS } from "openai/realtime/ws";

const REALTIME_MODEL = "gpt-realtime-mini";

export interface RealtimeTool {
  type: "function";
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface SpeakingRealtimeCallbacks {
  // base64 PCM16 24kHz audio delta to forward to the client
  onAudioDelta: (base64Audio: string) => void;
  // running transcript of what the examiner (AI) is saying
  onAiTranscriptDelta?: (text: string) => void;
  // final transcript of an examiner turn
  onAiTranscriptDone?: (text: string) => void;
  // transcript of what the candidate said (input audio transcription)
  onUserTranscript?: (text: string) => void;
  // the AI finished an output turn
  onResponseDone?: () => void;
  // server-side VAD detected the candidate started speaking (barge-in)
  onSpeechStarted?: () => void;
  // the model invoked one of the registered tools
  onFunctionCall?: (name: string, callItemId: string, argumentsJson: string) => void;
  onError: (message: string) => void;
  onClosed: () => void;
}

interface TurnDetectionConfig {
  type: "server_vad";
  threshold: number;
  prefix_padding_ms: number;
  silence_duration_ms: number;
  create_response: boolean;
  interrupt_response: boolean;
}

interface RealtimeSession {
  ws: OpenAIRealtimeWS;
  closed: boolean;
  voice: string;
  turnDetection: TurnDetectionConfig;
}

/**
 * Thin wrapper around the OpenAI Realtime API for the IELTS Speaking examiner.
 *
 * Compared to the generic audio-call service this adds the primitives the exam
 * conductor needs: per-response instruction overrides (to script transitions),
 * toggling auto-response (to enforce the Part 2 "long turn" where the examiner
 * must stay silent while the candidate speaks), and function-call support so
 * the model can signal when the Part 2 cue card has been delivered.
 */
@Injectable()
export class IeltsSpeakingRealtimeService {
  private readonly logger = new Logger(IeltsSpeakingRealtimeService.name);
  private readonly client: OpenAI | null;
  private readonly sessions = new Map<string, RealtimeSession>();

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>("OPENAI_API_KEY");
    if (!apiKey) {
      this.logger.warn(
        "OPENAI_API_KEY not set — AI speaking sessions are disabled.",
      );
      this.client = null;
      return;
    }
    this.client = new OpenAI({ apiKey });
  }

  isEnabled(): boolean {
    return this.client !== null;
  }

  async startSession(
    sessionId: string,
    opts: { instructions: string; voice?: string; tools?: RealtimeTool[] },
    cb: SpeakingRealtimeCallbacks,
  ): Promise<void> {
    if (!this.client) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }
    if (this.sessions.has(sessionId)) {
      throw new Error("A Realtime session already exists for this session.");
    }

    const ws = new OpenAIRealtimeWS({ model: REALTIME_MODEL }, this.client);
    const turnDetection: TurnDetectionConfig = {
      type: "server_vad",
      threshold: 0.5,
      prefix_padding_ms: 300,
      silence_duration_ms: 700,
      create_response: true,
      interrupt_response: true,
    };
    const session: RealtimeSession = {
      ws,
      closed: false,
      voice: opts.voice ?? "alloy",
      turnDetection,
    };
    this.sessions.set(sessionId, session);

    await new Promise<void>((resolve, reject) => {
      let settled = false;

      ws.socket.on("open", () => {
        ws.send({
          type: "session.update",
          session: {
            type: "realtime",
            output_modalities: ["audio"],
            instructions: opts.instructions,
            tools: opts.tools ?? [],
            tool_choice: opts.tools?.length ? "auto" : "none",
            audio: {
              input: {
                format: { type: "audio/pcm", rate: 24000 },
                transcription: {
                  model: "gpt-4o-mini-transcribe",
                  language: "en",
                },
                turn_detection: turnDetection,
              },
              output: {
                format: { type: "audio/pcm", rate: 24000 },
                voice: session.voice,
              },
            },
          },
        });
        if (!settled) {
          settled = true;
          resolve();
        }
      });

      // The exam conductor (gateway) drives the first turn explicitly, so we do
      // NOT auto-respond on session.updated here.

      ws.on("error", (err: any) => {
        const msg = err?.message ?? "Realtime connection error";
        this.logger.error(`Realtime error (session ${sessionId}): ${msg}`);
        cb.onError(msg);
        if (!settled) {
          settled = true;
          reject(new Error(msg));
        }
      });

      ws.on("response.output_audio.delta", (event: any) => {
        if (event?.delta) cb.onAudioDelta(event.delta);
      });

      ws.on("response.output_audio_transcript.delta", (event: any) => {
        if (event?.delta && cb.onAiTranscriptDelta) {
          cb.onAiTranscriptDelta(event.delta);
        }
      });

      ws.on("response.output_audio_transcript.done", (event: any) => {
        if (event?.transcript && cb.onAiTranscriptDone) {
          cb.onAiTranscriptDone(event.transcript);
        }
      });

      ws.on(
        "conversation.item.input_audio_transcription.completed",
        (event: any) => {
          if (event?.transcript && cb.onUserTranscript) {
            cb.onUserTranscript(event.transcript);
          }
        },
      );

      ws.on("input_audio_buffer.speech_started", () => {
        if (cb.onSpeechStarted) cb.onSpeechStarted();
      });

      ws.on("response.function_call_arguments.done", (event: any) => {
        if (cb.onFunctionCall && event?.name) {
          cb.onFunctionCall(event.name, event.call_id, event.arguments ?? "{}");
        }
      });

      ws.on("response.done", () => {
        if (cb.onResponseDone) cb.onResponseDone();
      });

      ws.socket.on("close", () => {
        session.closed = true;
        this.sessions.delete(sessionId);
        cb.onClosed();
      });
    });
  }

  /** Forward a base64 PCM16 chunk from the candidate's mic to OpenAI. */
  appendAudio(sessionId: string, base64Audio: string): void {
    const session = this.sessions.get(sessionId);
    if (!session || session.closed) return;
    session.ws.send({ type: "input_audio_buffer.append", audio: base64Audio });
  }

  /** Discard any uncommitted audio in the input buffer. */
  clearInput(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session || session.closed) return;
    session.ws.send({ type: "input_audio_buffer.clear" });
  }

  /**
   * Ask the model to produce a response now. When `instructions` is given they
   * override the session instructions for this one response only — used to
   * script the examiner's transitions (greeting, part changes, time-up cues).
   */
  respond(sessionId: string, instructions?: string): void {
    const session = this.sessions.get(sessionId);
    if (!session || session.closed) return;
    session.ws.send(
      instructions
        ? { type: "response.create", response: { instructions } }
        : { type: "response.create" },
    );
  }

  /** Stop the in-flight examiner response (e.g. on barge-in or time-up). */
  cancelResponse(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session || session.closed) return;
    session.ws.send({ type: "response.cancel" });
  }

  /**
   * Acknowledge a tool call so the conversation stays consistent. Does NOT
   * trigger a new response — the conductor decides what happens next.
   */
  sendFunctionOutput(
    sessionId: string,
    callItemId: string,
    output: Record<string, unknown>,
  ): void {
    const session = this.sessions.get(sessionId);
    if (!session || session.closed) return;
    session.ws.send({
      type: "conversation.item.create",
      item: {
        type: "function_call_output",
        call_id: callItemId,
        output: JSON.stringify(output),
      },
    });
  }

  /**
   * Toggle whether server VAD auto-creates examiner responses. Turned OFF for
   * the Part 2 long turn so the examiner stays silent while the candidate
   * speaks for the full window; turned back ON for Parts 1 and 3.
   */
  setAutoResponse(sessionId: string, enabled: boolean): void {
    const session = this.sessions.get(sessionId);
    if (!session || session.closed) return;
    session.turnDetection.create_response = enabled;
    session.ws.send({
      type: "session.update",
      session: {
        type: "realtime",
        audio: { input: { turn_detection: session.turnDetection } },
      },
    });
  }

  endSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    try {
      session.ws.close();
    } catch {
      // ignore close errors
    }
    this.sessions.delete(sessionId);
  }

  hasSession(sessionId: string): boolean {
    return this.sessions.has(sessionId);
  }
}
