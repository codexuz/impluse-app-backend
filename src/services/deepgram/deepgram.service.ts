import { Injectable } from "@nestjs/common";
import { createClient } from "@deepgram/sdk";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DeepgramService {
  private readonly deepgram: any;
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>("DEEPGRAM_API_KEY");
    this.deepgram = createClient(apiKey);
  }

  async transcribeRemoteAudio(audioUrl: string): Promise<any> {
    const { result, error } =
      await this.deepgram.listen.prerecorded.transcribeUrl(
        {
          url: audioUrl,
        },
        {
          smart_format: true,
          filler_words: true,
          model: "nova3",
        }
      );
    if (error) throw error;
    return result;
  }

  async transcribeLocalAudio(audioFile: string): Promise<any> {
    const { result, error } =
      await this.deepgram.listen.prerecorded.transcribeFile(audioFile, {
        smart_format: true,
        filler_words: true,
        model: "nova3",
      });
    if (error) throw error;
    return result;
  }
}
