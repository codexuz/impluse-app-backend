var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var VoiceChatBotGateway_1;
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { VoiceChatBotService } from './voice-chat-bot.service.js';
let VoiceChatBotGateway = VoiceChatBotGateway_1 = class VoiceChatBotGateway {
    constructor(voiceChatBotService) {
        this.voiceChatBotService = voiceChatBotService;
        this.logger = new Logger(VoiceChatBotGateway_1.name);
        this.connectedClients = new Map();
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
        this.connectedClients.set(client.id, client);
        client.emit('connected', {
            message: 'Connected to Chat Bot',
            clientId: client.id,
            timestamp: new Date().toISOString(),
        });
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.connectedClients.delete(client.id);
    }
    async handleMessage(data, client) {
        try {
            this.logger.log(`Message from ${client.id}: ${data.text}`);
            const result = await this.voiceChatBotService.processVoiceChat(data.text, data.voice || 'lauren');
            client.emit('message-response', {
                text: result.textResponse,
                timestamp: new Date().toISOString(),
            });
            if (data.preferVoice && result.audioStream) {
                client.emit('voice-response', {
                    audioData: result.audioStream,
                    timestamp: new Date().toISOString(),
                });
            }
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Chat error: ${error.message}`);
            client.emit('error', {
                message: error.message,
                timestamp: new Date().toISOString(),
            });
            return { success: false, error: error.message };
        }
    }
    async handleVoiceMessage(data, client) {
        try {
            this.logger.log(`Voice message from ${client.id}`);
            let audioBuffer;
            if (typeof data.audioData === 'string') {
                audioBuffer = Buffer.from(data.audioData, 'base64');
            }
            else if (Buffer.isBuffer(data.audioData)) {
                audioBuffer = data.audioData;
            }
            else {
                throw new Error('Invalid audio data format');
            }
            const transcribedText = await this.voiceChatBotService.speechToText(audioBuffer, data.mimeType || 'audio/mpeg');
            if (!transcribedText.trim()) {
                throw new Error('Could not transcribe audio message');
            }
            const result = await this.voiceChatBotService.processVoiceChat(transcribedText, 'lauren');
            client.emit('message-response', {
                text: result.textResponse,
                originalVoiceText: transcribedText,
                timestamp: new Date().toISOString(),
            });
            if (data.preferVoice && result.audioStream) {
                client.emit('voice-response', {
                    audioData: result.audioStream,
                    timestamp: new Date().toISOString(),
                });
            }
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Voice message error: ${error.message}`);
            client.emit('error', {
                message: error.message,
                timestamp: new Date().toISOString(),
            });
            return { success: false, error: error.message };
        }
    }
};
__decorate([
    WebSocketServer(),
    __metadata("design:type", Server)
], VoiceChatBotGateway.prototype, "server", void 0);
__decorate([
    SubscribeMessage('send-message'),
    __param(0, MessageBody()),
    __param(1, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Socket]),
    __metadata("design:returntype", Promise)
], VoiceChatBotGateway.prototype, "handleMessage", null);
__decorate([
    SubscribeMessage('send-voice'),
    __param(0, MessageBody()),
    __param(1, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Socket]),
    __metadata("design:returntype", Promise)
], VoiceChatBotGateway.prototype, "handleVoiceMessage", null);
VoiceChatBotGateway = VoiceChatBotGateway_1 = __decorate([
    Injectable(),
    WebSocketGateway({
        cors: {
            origin: '*',
        },
        namespace: '/chat-bot',
    }),
    __metadata("design:paramtypes", [VoiceChatBotService])
], VoiceChatBotGateway);
export { VoiceChatBotGateway };
//# sourceMappingURL=voice-chat-bot.gateway.js.map