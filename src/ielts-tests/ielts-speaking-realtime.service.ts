import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { OpenAIRealtimeWS } from "openai/realtime/ws";

const REALTIME_MODEL = "gpt-realtime-mini";
const FEEDBACK_MODEL = "gpt-4o-mini";

export interface SpeakingBandFeedback {
  overall_band: number;
  criteria: {
    fluency_coherence: number;
    lexical_resource: number;
    grammatical_range_accuracy: number;
    pronunciation: number;
    topic_relevance: number;
  };
  summary: string;
  strengths: string[];
  improvements: string[];
}

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
  // True while the examiner has a response in flight. We hold the mic closed
  // for this window so the bot never "hears itself" or gets barged into before
  // it has finished speaking.
  examinerSpeaking: boolean;
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
      // The examiner must finish its turn before the candidate is heard — no
      // barge-in. We also gate the mic in appendAudio so audio captured while
      // the examiner is speaking is discarded rather than buffered.
      interrupt_response: false,
    };
    const session: RealtimeSession = {
      ws,
      closed: false,
      voice: opts.voice ?? "alloy",
      turnDetection,
      examinerSpeaking: false,
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

      // The examiner is "speaking" from the moment a response is created until
      // it is done; while this holds we drop incoming mic audio (see
      // appendAudio) so the bot doesn't listen until it stops talking.
      ws.on("response.created", () => {
        session.examinerSpeaking = true;
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
        session.examinerSpeaking = false;
        // Discard anything the mic captured while the examiner was talking so
        // the candidate's real answer starts from a clean buffer.
        if (!session.closed) {
          session.ws.send({ type: "input_audio_buffer.clear" });
        }
        if (cb.onResponseDone) cb.onResponseDone();
      });

      ws.socket.on("close", () => {
        session.closed = true;
        this.sessions.delete(sessionId);
        cb.onClosed();
      });
    });
  }

  /**
   * Forward a base64 PCM16 chunk from the candidate's mic to OpenAI. While the
   * examiner has a turn in flight we drop the chunk: the bot must not start
   * listening until it has finished its own speech.
   */
  appendAudio(sessionId: string, base64Audio: string): void {
    const session = this.sessions.get(sessionId);
    if (!session || session.closed || session.examinerSpeaking) return;
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
    session.examinerSpeaking = false;
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

  /**
   * Produce an IELTS band-score feedback summary from a finished session's
   * transcript using a (non-realtime) chat completion. Returns null if the
   * client is unavailable or the model output can't be parsed. Pronunciation
   * is estimated cautiously since it can't be fully judged from text.
   */
  async generateBandFeedback(
    topicTitle: string,
    transcript: Array<{ role: "examiner" | "candidate"; text: string }>,
  ): Promise<SpeakingBandFeedback | null> {
    if (!this.client) return null;

    const candidateTurns = transcript.filter((t) => t.role === "candidate");
    if (candidateTurns.length === 0) return null;

    const dialogue = transcript
      .map((t) => `${t.role === "examiner" ? "Examiner" : "Candidate"}: ${t.text}`)
      .join("\n");

    try {
      const completion = await this.client.chat.completions.create({
        model: FEEDBACK_MODEL,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a strict but fair certified IELTS Speaking examiner. Assess ONLY the " +
              "candidate's turns, judged against the examiner's questions and the test topic. " +
              "Return JSON with these exact fields:\n" +
              `{
  "overall_band": <number 0-9, rounded to nearest 0.5>,
  "criteria": {
    "fluency_coherence": <0-9, nearest 0.5>,
    "lexical_resource": <0-9, nearest 0.5>,
    "grammatical_range_accuracy": <0-9, nearest 0.5>,
    "pronunciation": <0-9, nearest 0.5>,
    "topic_relevance": <0-9, nearest 0.5>
  },
  "summary": "2-3 sentence overall assessment",
  "strengths": ["short bullet", "..."],
  "improvements": ["short actionable bullet", "..."]
}\n\n` +
              "Scoring rules — apply the official IELTS band descriptors and do NOT inflate:\n" +
              "- There is NO default or courtesy band. Score strictly from the language the " +
              "candidate actually produced. A candidate who barely speaks must NOT receive a " +
              "mid-band score.\n" +
              "- topic_relevance measures how directly and fully each answer addresses the " +
              "examiner's question and the test topic. 8-9 = answers fully and stays on topic; " +
              "5-6 = partially relevant or under-developed; 3-4 = mostly vague, evasive or " +
              "drifting off topic; 1-2 = does not answer the questions or is off topic.\n" +
              "- Non-answers count as failure to communicate: filler like \"hmm\", \"I don't " +
              "know\", silence, one-word replies, or content unrelated to the question must " +
              "score Band 1.0-2.0 across the relevant criteria — never 4.0.\n" +
              "- overall_band must be consistent with topic_relevance: if the candidate largely " +
              "fails to answer on topic, overall_band cannot exceed ~3.5 no matter how a few " +
              "isolated words look. Roughly average the five criteria, then sanity-check against " +
              "the descriptors.\n" +
              "- Very short, undeveloped, or repetitive answers cap fluency_coherence and " +
              "lexical_resource regardless of accuracy.\n" +
              "- Pronunciation cannot be fully judged from text, so estimate it conservatively " +
              "from word choice and structure and note this limitation in the summary.\n" +
              "Keep strengths and improvements to max 4 each. If the candidate produced almost " +
              "no usable language, say so plainly in the summary.",
          },
          {
            role: "user",
            content:
              `Speaking test topic: "${topicTitle}"\n\n` +
              "Below is the live transcript. Judge each candidate turn against the examiner " +
              "question that precedes it for topic relevance.\n\n" +
              `Transcript:\n${dialogue}`,
          },
        ],
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) return null;
      return JSON.parse(content) as SpeakingBandFeedback;
    } catch (e: any) {
      this.logger.error(`Failed to generate band feedback: ${e?.message}`);
      return null;
    }
  }
}
