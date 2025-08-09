import { Response } from 'express';
import { VoiceChatBotService } from './voice-chat-bot.service.js';
declare class VoiceChatDto {
    text: string;
    voice?: string;
}
declare class TextToVoiceDto {
    text: string;
    voice?: string;
}
export declare class VoiceChatBotController {
    private readonly voiceChatBotService;
    constructor(voiceChatBotService: VoiceChatBotService);
    voiceChat(voiceChatDto: VoiceChatDto): Promise<{
        textResponse: string;
        hasAudio: boolean;
        message: string;
    }>;
    voiceChatStream(voiceChatDto: VoiceChatDto, res: Response): Promise<void>;
    generateVoiceResponse(voiceChatDto: VoiceChatDto): Promise<{
        textResponse: string;
        audioData: any;
    }>;
    textToVoice(textToVoiceDto: TextToVoiceDto, res: Response): Promise<void>;
}
export {};
