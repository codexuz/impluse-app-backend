import { Injectable } from '@nestjs/common';
import { SpeechifyClient } from "@speechify/api";
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class SpeechifyService {
  private client: SpeechifyClient;

  constructor(private configService: ConfigService) {
    this.client = new SpeechifyClient({
      token: this.configService.get<string>('speechifyToken'),
    });
  }

  /**
   * Normalize whitespace and line breaks.
   * Returns an empty string if input contains no printable characters.
   */
  private cleanText(text: string): string {
    if (!text) return '';
    return text
      .replace(/\r\n/g, '\n')     // normalize CRLF to LF
      .replace(/\n+/g, ' ')       // convert one or many line breaks to single space
      .replace(/\s+/g, ' ')       // collapse multiple spaces
      .trim();
  }

  /**
   * Streams TTS audio and returns a data URL (base64). 
   * Returns null when input text is empty or whitespace-only.
   */
  async streamTexttoSpeech(text: string, voice: string): Promise<string | null> {
    try {
      const cleanedText = this.cleanText(text);
      if (!cleanedText) {
        // No text to speak — return null (no error)
        return null;
      }

      const stream = await this.client.tts.audio.stream({
        accept: "audio/mpeg",
        input: cleanedText,
        voiceId: voice
      });

      const chunks: Buffer[] = [];
      for await (const chunk of stream as Readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }

      const audioBuffer = Buffer.concat(chunks);
      const base64Audio = `data:audio/mpeg;base64,${audioBuffer.toString("base64")}`;
      return base64Audio;
    } catch (error) {
      // Re-throw keeping original message shape
      throw new Error(`Failed to convert text to speech: ${error?.message ?? error}`);
    }
  }

  /**
   * Generates TTS (non-stream) using Speechify SDK.
   * Returns whatever the SDK returns, or null if no text was provided.
   */
  async generateTexttoSpeech(text: string, voice: string): Promise<any | null> {
    try {
      const cleanedText = this.cleanText(text);
      if (!cleanedText) {
        return null;
      }
      return await this.client.tts.audio.speech({
        input: cleanedText,
        voiceId: voice
      });
    } catch (error) {
      throw new Error(`Failed to convert text to speech: ${error?.message ?? error}`);
    }
  }  
}
