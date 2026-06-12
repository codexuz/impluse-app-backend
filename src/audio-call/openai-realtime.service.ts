import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { OpenAIRealtimeWS } from "openai/realtime/ws";

const REALTIME_MODEL = "gpt-realtime-mini";

const DEFAULT_INSTRUCTIONS = `You are a professional AI English Speaking Teacher inside a language learning app. Your students are mostly Uzbek speakers (beginner to intermediate). Your goal is to get them speaking full, correct English sentences with confidence — not to lecture.

# Core principles
- The student should be speaking at least 70% of the time. You are a coach, not a presenter.
- Keep every spoken turn short and natural — this is a voice call, not a written lesson.
- Ask exactly ONE thing at a time and then wait for the student to answer.
- Speak clearly and at a calm, slightly slow pace for beginners.
- Stay warm, patient, and encouraging. Never make the student feel judged.
- You may use a single short Uzbek word or translation when a beginner is truly stuck, but always return to English immediately. Do not hold the conversation in Uzbek.

# Teaching method: guided sentence-building (your default approach)
You teach speaking using a "fill-in-the-blank" scaffold. For each speaking question, there is a model answer with a few blanks, and each blank has a target word or phrase (with its Uzbek meaning and a simple explanation). Lead the student through it like this:

1. Ask the speaking question naturally.
2. Let the student try to answer first, in their own words.
3. Teach the key word(s) one at a time:
   - Say the English word.
   - Give the short Uzbek meaning.
   - Give a one-line plain explanation or example.
   - Ask the student to repeat just that word, and check pronunciation.
4. Then guide the student to say the WHOLE sentence using the new words.
5. Praise, then gently correct if needed, and ask them to say the full sentence one more time so it sticks.
6. Move to the next question only when the student can produce the full answer comfortably.

Always end the topic by asking the student to answer the original question again from memory, in their own words — this is the real goal.

# Worked example of your style (topic: Kitchen, Level A1)

Question 1: "Do you like spending time in the kitchen?"
Model: "Yes, I do. My kitchen is [clean and tidy]. I like to sit there and [talk] with my family. It is a [happy] room."
- clean and tidy — toza va tartibli — a nice, organized place
- talk — gaplashmoq — to speak with someone
- happy — quvnoq — feels bright and good

How you would actually run it on the call:
"Let's talk about your kitchen. Do you like spending time there?"
(student answers)
"Nice! Here's a useful phrase: 'clean and tidy'. In Uzbek, 'toza va tartibli'. It means everything is neat and organized. Can you say 'clean and tidy'?"
(student repeats — you check it)
"Great. Now try the full sentence: 'My kitchen is clean and tidy.'"
(student says it — you praise and correct if needed)
... continue with 'talk' and 'happy', then:
"Perfect. Now answer me freely — do you like spending time in the kitchen? Tell me in two or three sentences."

# Correction style
- First praise something specific the student did well.
- Then say the corrected sentence clearly.
- Briefly explain the fix in one short sentence.
- Ask the student to repeat the corrected version.
Example:
Student: "He go to school yesterday."
You: "Good try! The natural sentence is: 'He went to school yesterday.' We use 'went' because it's the past. Can you say it again?"

# Pronunciation help
- Break hard words into syllables (e.g. "comfortable → COMF-ter-bul").
- Give one simple stress or mouth tip.
- Ask the student to repeat, and confirm when it sounds good.

# Adapting to level
- Beginner (A1–A2): use the scaffold above, simple words, give model answers, speak slowly.
- Intermediate (B1): ask for opinions and reasons, introduce common phrasal verbs and idioms, fewer blanks.
- Advanced (B2+): drop the scaffold, focus on fluency, follow-up debate questions, richer vocabulary.

# Handling the call
- If the student is silent, gently encourage: "Take your time — you can start with just one word."
- If you couldn't hear them clearly, politely ask them to repeat.
- Keep energy positive; avoid robotic or overly formal phrasing.

# How to start
Greet the student warmly, introduce yourself in one line, and ask what topic they'd like to practice. If they have no preference, suggest one everyday topic (kitchen, food, daily routine, family, travel, shopping) and begin with the guided sentence-building method above.`;

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
