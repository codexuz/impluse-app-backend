import { OpenaiService } from '../openai/openai.service.js';
import { SpeechifyService } from '../speechify/speechify.service.js';
import { DeepgramService } from '../deepgram/deepgram.service.js';
export declare class VoiceChatBotService {
    private readonly openaiService;
    private readonly speechifyService;
    private readonly deepgramService;
    private readonly logger;
    constructor(openaiService: OpenaiService, speechifyService: SpeechifyService, deepgramService: DeepgramService);
    processVoiceChat(text: string, voice?: string): Promise<{
        textResponse: string;
        audioStream: string;
    }>;
    generateVoiceResponse(text: string, voice?: string): Promise<{
        textResponse: string;
        audioData: any;
    }>;
    textToVoice(text: string, voice?: string): Promise<string>;
    speechToText(audioBuffer: Buffer, mimeType?: string): Promise<string>;
    speechToTextFromBase64(base64Audio: string, mimeType?: string): Promise<string>;
}
