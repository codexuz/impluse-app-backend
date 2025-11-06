import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { VoiceChatBotService } from './voice-chat-bot.service.js';
interface ChatMessage {
    text: string;
    voice?: string;
    userId?: string;
    preferVoice: boolean;
}
interface AudioUploadMessage {
    audioData: string | Buffer;
    userId?: string;
    preferVoice: boolean;
    mimeType?: string;
}
export declare class VoiceChatBotGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly voiceChatBotService;
    server: Server;
    private readonly logger;
    private connectedClients;
    constructor(voiceChatBotService: VoiceChatBotService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleMessage(data: ChatMessage, client: Socket): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    handleVoiceMessage(data: AudioUploadMessage, client: Socket): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
}
export {};
