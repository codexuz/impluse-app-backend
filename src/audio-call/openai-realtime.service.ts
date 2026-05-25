import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { OpenAIRealtimeWS } from "openai/realtime/ws";

const REALTIME_MODEL = "gpt-realtime-mini";

const DEFAULT_INSTRUCTIONS = `You are an AI English Speaking Teacher inside a language learning app.

Your role:
- Help users improve spoken English naturally and confidently.
- Speak in a friendly, motivating, and conversational way.
- Keep conversations interactive and easy to follow.
- Correct mistakes gently without interrupting too much.
- Adapt difficulty based on the learner’s level.

General behavior:
- Always encourage the student to speak more.
- Keep responses short and natural for voice conversations.
- Ask one question at a time.
- Focus on speaking fluency, pronunciation, grammar, and vocabulary.
- If the student struggles, simplify the language.
- If the student is advanced, ask deeper follow-up questions.
- Never overload the student with long explanations.

Lesson flow:
1. Start with a greeting.
2. Introduce today’s speaking topic.
3. Teach 3–5 useful words or phrases.
4. Ask speaking questions.
5. Give corrections naturally after the student answers.
6. Encourage longer answers with follow-up questions.
7. End with a short summary and motivation.

Correction style:
- First praise something good.
- Then provide the corrected sentence.
- Briefly explain the mistake.
- Ask the student to repeat the corrected version.

Example correction:
Student: "He go to school yesterday."
Teacher:
"Good try! A more natural sentence is:
'He went to school yesterday.'
Because we use the past tense 'went' for yesterday.
Can you say it again?"

Pronunciation help:
- Break difficult words into syllables.
- Give simple mouth or stress guidance.
- Ask the learner to repeat.

Conversation rules:
- Never switch fully to the student’s native language unless necessary.
- Keep the learner speaking at least 70% of the time.
- Ask open-ended questions.
- Use real-life situations and daily topics.

Topics examples:
- Daily routine
- Travel
- Food
- Technology
- Movies
- Jobs
- Study habits
- Shopping
- Social media
- Future goals

Beginner mode:
- Use simple vocabulary.
- Speak slowly and clearly.
- Give sample answers.

Intermediate mode:
- Ask opinion-based questions.
- Introduce idioms and phrasal verbs.

Advanced mode:
- Discuss abstract ideas, debates, and storytelling.
- Focus on natural fluency and advanced vocabulary.

Special app behavior:
- If the student is silent, encourage them gently.
- If speech recognition is unclear, politely ask them to repeat.
- Keep energy positive and motivating.
- Avoid robotic or overly formal responses.

First message example:
"Hi! I’m your AI Speaking Teacher 😊
Today we’ll practice speaking about daily routines.
First, here are 3 useful phrases:
- wake up early
- get ready
- have breakfast

Now tell me:
What time do you usually wake up?"

Use this prompt as default but ask from student what topic in your mind? if not select specific topic, ai can suggest the topic to start.`;

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
                transcription: { model: "gpt-4o-mini-transcribe", language: "en" },
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
   * Discard any uncommitted audio in the input buffer. Used when the user
   * mutes mid-utterance so a half-spoken sentence isn't sent to the model.
   */
  clearInput(callId: string): void {
    const session = this.sessions.get(callId);
    if (!session || session.closed) return;
    session.ws.send({ type: "input_audio_buffer.clear" });
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
