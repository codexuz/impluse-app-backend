import { ConfigService } from "@nestjs/config";
export declare class DeepgramService {
    private readonly configService;
    private readonly deepgram;
    constructor(configService: ConfigService);
    transcribeRemoteAudio(audioUrl: string): Promise<any>;
    transcribeLocalAudio(audioFile: string): Promise<any>;
    transcribeBuffer(audioBuffer: Buffer, mimetype?: string): Promise<any>;
}
