import { VoiceChatBotService } from './voice-chat-bot.service.js';
import { VoiceChatDto, TextToVoiceDto, SpeechToTextDto } from './dto/index.js';
export declare class VoiceChatBotController {
    private readonly voiceChatBotService;
    constructor(voiceChatBotService: VoiceChatBotService);
    voiceChat(voiceChatDto: VoiceChatDto): Promise<{
        textResponse: string;
        hasAudio: boolean;
        message: string;
    }>;
    voiceChatStream(voiceChatDto: VoiceChatDto): Promise<{
        success: boolean;
        textResponse: string;
        audioData: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        textResponse?: undefined;
        audioData?: undefined;
    }>;
    generateVoiceResponse(voiceChatDto: VoiceChatDto): Promise<{
        textResponse: string;
        audioData: any;
    }>;
    textToVoice(textToVoiceDto: TextToVoiceDto): Promise<{
        success: boolean;
        audioData: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        audioData?: undefined;
    }>;
    speechToText(speechToTextDto: SpeechToTextDto): Promise<{
        success: boolean;
        text: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        text?: undefined;
    }>;
}
