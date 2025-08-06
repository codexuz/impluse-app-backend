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

  async streamTexttoSpeech(text: string, voice: string = 'lisa'): Promise<string> {
    try {
      const stream = await this.client.tts.audio.stream({
        accept: "audio/mpeg",
        input: text,
        voiceId: voice
      });

      const chunks: Buffer[] = [];
      for await (const chunk of stream as Readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }

      const audioBuffer = Buffer.concat(chunks);
      const base64Audio = audioBuffer.toString('base64');
      return base64Audio
    } catch (error) {
      throw new Error(`Failed to convert text to speech: ${error.message}`);
    }
  }

  async generateTexttoSpeech(text: string, voice: string = 'lisa'): Promise<any> {
        try {
            return await this.client.tts.audio.speech({
                input: text,
                voiceId: voice
            });
        } catch (error) {
            throw new Error(`Failed to convert text to speech: ${error.message}`);
        }
    }  
}




