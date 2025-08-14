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
            message: 'Connected to Voice Chat Bot',
            clientId: client.id,
            timestamp: new Date().toISOString(),
        });
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.connectedClients.delete(client.id);
    }
    async handleTextChat(data, client) {
        try {
            this.logger.log(`Text chat from ${client.id}: ${data.text}`);
            const result = await this.voiceChatBotService.processVoiceChat(data.text);
            client.emit('text-response', {
                textResponse: result.textResponse,
                timestamp: new Date().toISOString(),
                clientId: client.id,
            });
            return { success: true, message: 'Text response sent' };
        }
        catch (error) {
            this.logger.error(`Text chat error: ${error.message}`);
            client.emit('error', {
                message: error.message,
                type: 'text-chat-error',
                timestamp: new Date().toISOString(),
            });
            return { success: false, error: error.message };
        }
    }
    async handleVoiceChat(data, client) {
        try {
            this.logger.log(`Voice chat from ${client.id}: ${data.text}`);
            const result = await this.voiceChatBotService.processVoiceChat(data.text, data.voice || 'lauren');
            console.log(result);
            client.emit('text-response', {
                textResponse: result.textResponse,
                timestamp: new Date().toISOString(),
                clientId: client.id,
            });
            if (result.audioStream) {
                client.emit('audio-response', {
                    hasAudio: true,
                    audioData: result.audioStream,
                    message: 'Audio stream ready',
                    timestamp: new Date().toISOString(),
                    clientId: client.id,
                });
            }
            else {
                client.emit('audio-response', {
                    hasAudio: false,
                    message: 'Audio generation failed',
                    timestamp: new Date().toISOString(),
                    clientId: client.id,
                });
            }
            return { success: true, message: 'Voice response processed' };
        }
        catch (error) {
            this.logger.error(`Voice chat error: ${error.message}`);
            client.emit('error', {
                message: error.message,
                type: 'voice-chat-error',
                timestamp: new Date().toISOString(),
            });
            return { success: false, error: error.message };
        }
    }
    async handleTextToVoice(data, client) {
        try {
            this.logger.log(`Text to voice from ${client.id}: ${data.text}`);
            const audioStream = await this.voiceChatBotService.textToVoice(data.text, data.voice || 'lauren');
            if (audioStream) {
                const audioChunks = [];
                audioStream.on('data', (chunk) => {
                    audioChunks.push(chunk);
                });
                audioStream.on('end', () => {
                    const audioBuffer = Buffer.concat(audioChunks);
                    client.emit('voice-ready', {
                        success: true,
                        hasAudio: true,
                        audioData: audioBuffer,
                        message: 'Voice conversion completed',
                        timestamp: new Date().toISOString(),
                    });
                });
                audioStream.on('error', (error) => {
                    this.logger.error(`TTS stream error: ${error.message}`);
                    client.emit('error', {
                        message: `TTS stream error: ${error.message}`,
                        type: 'tts-stream-error',
                        timestamp: new Date().toISOString(),
                    });
                });
            }
            else {
                client.emit('voice-ready', {
                    success: false,
                    hasAudio: false,
                    message: 'Voice conversion failed',
                    timestamp: new Date().toISOString(),
                });
            }
            return { success: true, message: 'Text converted to voice' };
        }
        catch (error) {
            this.logger.error(`Text to voice error: ${error.message}`);
            client.emit('error', {
                message: error.message,
                type: 'text-to-voice-error',
                timestamp: new Date().toISOString(),
            });
            return { success: false, error: error.message };
        }
    }
    sendToClient(clientId, event, data) {
        const client = this.connectedClients.get(clientId);
        if (client) {
            client.emit(event, data);
        }
    }
    broadcast(event, data) {
        this.server.emit(event, data);
    }
    async handleSpeechToText(data, client) {
        try {
            this.logger.log(`Speech to text request from ${client.id}`);
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
            client.emit('stt-processing', {
                message: 'Processing speech to text...',
                timestamp: new Date().toISOString(),
            });
            const transcribedText = await this.voiceChatBotService.speechToText(audioBuffer, data.mimeType || 'audio/mpeg');
            client.emit('stt-result', {
                success: true,
                text: transcribedText,
                timestamp: new Date().toISOString(),
            });
            if (transcribedText.trim()) {
                this.handleVoiceChat({
                    text: transcribedText,
                    userId: data.userId,
                    sessionId: data.sessionId,
                }, client);
            }
            return { success: true, message: 'Speech processed' };
        }
        catch (error) {
            this.logger.error(`Speech to text error: ${error.message}`);
            client.emit('error', {
                message: error.message,
                type: 'speech-to-text-error',
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
    SubscribeMessage('text-chat'),
    __param(0, MessageBody()),
    __param(1, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Socket]),
    __metadata("design:returntype", Promise)
], VoiceChatBotGateway.prototype, "handleTextChat", null);
__decorate([
    SubscribeMessage('voice-chat'),
    __param(0, MessageBody()),
    __param(1, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Socket]),
    __metadata("design:returntype", Promise)
], VoiceChatBotGateway.prototype, "handleVoiceChat", null);
__decorate([
    SubscribeMessage('text-to-voice'),
    __param(0, MessageBody()),
    __param(1, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Socket]),
    __metadata("design:returntype", Promise)
], VoiceChatBotGateway.prototype, "handleTextToVoice", null);
__decorate([
    SubscribeMessage('speech-to-text'),
    __param(0, MessageBody()),
    __param(1, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Socket]),
    __metadata("design:returntype", Promise)
], VoiceChatBotGateway.prototype, "handleSpeechToText", null);
VoiceChatBotGateway = VoiceChatBotGateway_1 = __decorate([
    Injectable(),
    WebSocketGateway({
        cors: {
            origin: '*',
        },
        namespace: '/voice-chat',
    }),
    __metadata("design:paramtypes", [VoiceChatBotService])
], VoiceChatBotGateway);
export { VoiceChatBotGateway };
//# sourceMappingURL=voice-chat-bot.gateway.js.map