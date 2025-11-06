import { ConfigService } from '@nestjs/config';
export declare class SpeechifyService {
    private configService;
    private client;
    constructor(configService: ConfigService);
    streamTexttoSpeech(text: string, voice: string): Promise<string>;
    generateTexttoSpeech(text: string, voice: string): Promise<any>;
}
