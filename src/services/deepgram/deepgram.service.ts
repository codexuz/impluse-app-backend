import { Injectable } from "@nestjs/common";
import { DeepgramClient } from "@deepgram/sdk";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DeepgramService {
  private readonly deepgram: DeepgramClient;
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>("DEEPGRAM_API_KEY");
    this.deepgram = new DeepgramClient({ apiKey });
  }

  async transcribeRemoteAudio(audioUrl: string): Promise<any> {
    const response = await this.deepgram.listen.v1.media.transcribeUrl({
      url: audioUrl,
      smart_format: true,
      filler_words: true,
      model: "nova-3",
    });
    return response;
  }

  async transcribeLocalAudio(audioFile: string): Promise<any> {
    const response = await this.deepgram.listen.v1.media.transcribeFile(
      { path: audioFile },
      {
        smart_format: true,
        filler_words: true,
        model: "nova-3",
      },
    );
    return response;
  }

  async transcribeBuffer(
    audioBuffer: Buffer,
    mimetype: string = "audio/mpeg",
  ): Promise<any> {
    try {
      const response = await this.deepgram.listen.v1.media.transcribeFile(
        audioBuffer,
        {
          smart_format: true,
          filler_words: true,
          model: "nova-3",
        },
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to transcribe audio buffer: ${error.message}`);
    }
  }
}
