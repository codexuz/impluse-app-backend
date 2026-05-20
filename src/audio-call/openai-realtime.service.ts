import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { OpenAIRealtimeWS } from "openai/realtime/ws";

const REALTIME_MODEL = "gpt-realtime-mini";

const DEFAULT_INSTRUCTIONS =
  "You are a friendly, patient English-speaking tutor for language learners. " +
  "Speak clearly and at a moderate pace. Keep replies short and conversational, " +
  "gently correct mistakes, and always end with a question to keep the learner talking.";

export interface RealtimeCallbacks {
  // base64 PCM16 24kHz audio delta to forward to the client
  onAudioDelta: (base64Audio: string) => void;
  // running transcript of what the AI is saying
  onAiTranscriptDelta?: (text: string) => void;
  // transcript of what the user said (input audio transcription)
  onUserTranscript?: (text: string) => void;
  // AI finished a turn; client can stop playback ducking, etc.
  onResponseDone?: () => void;
  // server-side VAD detected the user started speaking (barge-in)
  onSpeechStarted?: () => void;
  onError: (message: string) => void;
  onClosed: () => void;
}

interface RealtimeSession {
  ws: OpenAIRealtimeWS;
  closed: boolean;
}

@Injectable()
export class OpenAiRealtimeService {
  private readonly logger = new Logger(OpenAiRealtimeService.name);
  private readonly client: OpenAI | null;
  private readonly sessions = new Map<string, RealtimeSession>();

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>("OPENAI_API_KEY");
    if (!apiKey) {
      this.logger.warn(
        "OPENAI_API_KEY not set — AI audio calls are disabled.",
      );
      this.client = null;
      return;
    }
    this.client = new OpenAI({ apiKey });
  }

  isEnabled(): boolean {
    return this.client !== null;
  }

  /**
   * Open a Realtime session for a call and wire OpenAI events to the
   * provided callbacks. Resolves once the session is configured.
   */
  async startSession(
    callId: string,
    opts: { instructions?: string; voice?: string },
    cb: RealtimeCallbacks,
  ): Promise<void> {
    if (!this.client) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }
    if (this.sessions.has(callId)) {
      throw new Error("A Realtime session already exists for this call.");
    }

    const ws = new OpenAIRealtimeWS({ model: REALTIME_MODEL }, this.client);
    const session: RealtimeSession = { ws, closed: false };
    this.sessions.set(callId, session);

    await new Promise<void>((resolve, reject) => {
      let settled = false;

      ws.socket.on("open", () => {
        // GA Realtime session shape (the beta `modalities` /
        // `input_audio_format` / top-level `voice` fields were removed).
        ws.send({
          type: "session.update",
          session: {
            type: "realtime",
            output_modalities: ["audio"],
            instructions: opts.instructions ?? DEFAULT_INSTRUCTIONS,
            audio: {
              input: {
                format: { type: "audio/pcm", rate: 24000 },
                transcription: { model: "whisper-1" },
                turn_detection: {
                  type: "server_vad",
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 600,
                },
              },
              output: {
                format: { type: "audio/pcm", rate: 24000 },
                voice: opts.voice ?? "alloy",
              },
            },
          },
        });
        if (!settled) {
          settled = true;
          resolve();
        }
      });

      ws.on("session.updated", () => {
        // Trigger the AI to speak first without waiting for user input
        ws.send({ type: "response.create" });
      });

      ws.on("error", (err: any) => {
        const msg = err?.message ?? "Realtime connection error";
        this.logger.error(`Realtime error (call ${callId}): ${msg}`);
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

      ws.on("response.done", () => {
        if (cb.onResponseDone) cb.onResponseDone();
      });

      ws.socket.on("close", () => {
        session.closed = true;
        this.sessions.delete(callId);
        cb.onClosed();
      });
    });
  }

  /** Forward a base64 PCM16 chunk from the client mic to OpenAI. */
  appendAudio(callId: string, base64Audio: string): void {
    const session = this.sessions.get(callId);
    if (!session || session.closed) return;
    session.ws.send({
      type: "input_audio_buffer.append",
      audio: base64Audio,
    });
  }

  /**
   * Manually close the current input buffer and request a response.
   * Only needed when server VAD is disabled; with server_vad the model
   * commits and responds automatically.
   */
  commitAndRespond(callId: string): void {
    const session = this.sessions.get(callId);
    if (!session || session.closed) return;
    session.ws.send({ type: "input_audio_buffer.commit" });
    session.ws.send({ type: "response.create" });
  }

  endSession(callId: string): void {
    const session = this.sessions.get(callId);
    if (!session) return;
    try {
      session.ws.close();
    } catch {
      // ignore close errors
    }
    this.sessions.delete(callId);
  }

  hasSession(callId: string): boolean {
    return this.sessions.has(callId);
  }
}
