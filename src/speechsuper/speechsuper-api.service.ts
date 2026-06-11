import { Injectable, Logger, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHash, randomUUID } from "crypto";
import axios from "axios";

export interface SpeechSuperRequestParams {
  /** The SpeechSuper coreType, e.g. "word.eval.promax". */
  coreType: string;
  /** Reference text for scripted coreTypes. */
  refText?: string;
  /** Any additional request params (test_type, task_type, question_prompt,
   *  model, penalize_offtopic, paragraph_need_word_score, ...). */
  [key: string]: any;
}

export interface SpeechSuperEvalInput {
  /** Raw audio bytes to assess. */
  audio: Buffer;
  /** Audio container type: wav | mp3 | opus | ogg | amr. */
  audioType: string;
  /** Sample rate in Hz (SpeechSuper requires 16000). */
  sampleRate?: number;
  /** Stable per-user id used in the start signature. */
  userId: string;
  /** coreType + extra request params. */
  requestParams: SpeechSuperRequestParams;
}

/**
 * Thin client for the SpeechSuper HTTP assessment API. Handles request
 * signing (sha1) and the multipart upload exactly as the official Node.js
 * sample does, then returns the parsed JSON response.
 *
 * @see https://github.com/speechsuper/speechsuper-api-samples (nodejs_http_sample)
 */
@Injectable()
export class SpeechSuperApiService {
  private readonly logger = new Logger(SpeechSuperApiService.name);
  private readonly appKey: string;
  private readonly secretKey: string;
  private readonly host: string;

  constructor(private readonly configService: ConfigService) {
    this.appKey = this.configService.get<string>("SPEECHSUPER_APP_KEY") ?? "";
    this.secretKey =
      this.configService.get<string>("SPEECHSUPER_SECRET_KEY") ?? "";
    this.host =
      this.configService.get<string>("SPEECHSUPER_HOST") ??
      "https://api.speechsuper.com";
  }

  private sha1(content: string): string {
    return createHash("sha1").update(content).digest("hex");
  }

  /** Builds the `text` field params block (connect + start) with signatures. */
  private buildParams(
    userId: string,
    audioType: string,
    sampleRate: number,
    requestParams: SpeechSuperRequestParams,
  ): Record<string, any> {
    const connectTs = Date.now().toString();
    const connectSig = this.sha1(this.appKey + connectTs + this.secretKey);

    const startTs = Date.now().toString();
    const startSig = this.sha1(
      this.appKey + startTs + userId + this.secretKey,
    );

    const params = { ...requestParams };
    if (!params.tokenId) {
      params.tokenId = randomUUID();
    }

    return {
      connect: {
        cmd: "connect",
        param: {
          sdk: { version: 16777472, source: 9, protocol: 2 },
          app: {
            applicationId: this.appKey,
            sig: connectSig,
            timestamp: connectTs,
          },
        },
      },
      start: {
        cmd: "start",
        param: {
          app: {
            applicationId: this.appKey,
            sig: startSig,
            userId,
            timestamp: startTs,
          },
          audio: {
            audioType,
            sampleRate,
            channel: 1,
            sampleBytes: 2,
          },
          request: params,
        },
      },
    };
  }

  /**
   * Run a single assessment. Returns the parsed SpeechSuper JSON response.
   * Throws ServiceUnavailableException on transport/credential failures.
   */
  async evaluate(input: SpeechSuperEvalInput): Promise<any> {
    if (!this.appKey || !this.secretKey) {
      throw new ServiceUnavailableException(
        "SpeechSuper credentials are not configured (SPEECHSUPER_APP_KEY / SPEECHSUPER_SECRET_KEY)",
      );
    }

    const sampleRate = input.sampleRate ?? 16000;
    const params = this.buildParams(
      input.userId,
      input.audioType,
      sampleRate,
      input.requestParams,
    );

    // axios accepts the same multipart shape the official sample builds with
    // form-data: a JSON `text` field plus the binary `audio` field.
    const FormData = (await import("form-data")).default;
    const form = new FormData();
    form.append("text", JSON.stringify(params));
    form.append("audio", input.audio, {
      filename: `audio.${input.audioType}`,
      contentType: "application/octet-stream",
    });

    const url = `${this.host}/${input.requestParams.coreType}`;

    try {
      const { data } = await axios.post(url, form, {
        headers: {
          ...form.getHeaders(),
          "Request-Index": "0",
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 60000,
      });
      return data;
    } catch (err: any) {
      const detail =
        err?.response?.data ?? err?.message ?? "unknown error";
      this.logger.error(
        `SpeechSuper request failed for ${input.requestParams.coreType}: ${JSON.stringify(detail)}`,
      );
      throw new ServiceUnavailableException(
        "SpeechSuper assessment request failed",
      );
    }
  }
}
