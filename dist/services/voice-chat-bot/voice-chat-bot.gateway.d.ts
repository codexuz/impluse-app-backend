import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { VoiceChatBotService } from './voice-chat-bot.service.js';
interface VoiceChatMessage {
    text: string;
    voice?: string;
    userId?: string;
    sessionId?: string;
}
interface AudioUploadMessage {
    audioData: string | Buffer;
    userId?: string;
    sessionId?: string;
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
    handleTextChat(data: VoiceChatMessage, client: Socket): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    handleVoiceChat(data: VoiceChatMessage, client: Socket): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    handleTextToVoice(data: {
        text: string;
        voice?: string;
    }, client: Socket): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    sendToClient(clientId: string, event: string, data: any): void;
    broadcast(event: string, data: any): void;
    handleSpeechToText(data: AudioUploadMessage, client: Socket): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
}
export {};
