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
import { Controller, Post, Body, HttpCode, HttpStatus, } from '@nestjs/common';
import { VoiceChatBotService } from './voice-chat-bot.service.js';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VoiceChatDto, TextToVoiceDto, SpeechToTextDto } from './dto/index.js';
let VoiceChatBotController = class VoiceChatBotController {
    constructor(voiceChatBotService) {
        this.voiceChatBotService = voiceChatBotService;
    }
    async voiceChat(voiceChatDto) {
        const result = await this.voiceChatBotService.processVoiceChat(voiceChatDto.text, voiceChatDto.voice);
        return {
            textResponse: result.textResponse,
            hasAudio: true,
            message: 'Use /voice-chat-bot/chat-stream for audio stream'
        };
    }
    async voiceChatStream(voiceChatDto) {
        try {
            const result = await this.voiceChatBotService.processVoiceChat(voiceChatDto.text, voiceChatDto.voice);
            return {
                success: true,
                textResponse: result.textResponse,
                audioData: result.audioStream
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async generateVoiceResponse(voiceChatDto) {
        return await this.voiceChatBotService.generateVoiceResponse(voiceChatDto.text, voiceChatDto.voice);
    }
    async textToVoice(textToVoiceDto) {
        try {
            console.log(`Converting text to voice: "${textToVoiceDto.text}" with voice: "${textToVoiceDto.voice}"`);
            const base64Audio = await this.voiceChatBotService.textToVoice(textToVoiceDto.text, textToVoiceDto.voice);
            return {
                success: true,
                audioData: base64Audio
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async speechToText(speechToTextDto) {
        try {
            const transcribedText = await this.voiceChatBotService.speechToTextFromBase64(speechToTextDto.base64Audio, speechToTextDto.mimeType);
            return {
                success: true,
                text: transcribedText
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};
__decorate([
    Post('chat'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Process chat - returns text response' }),
    ApiResponse({ status: 200, description: 'Chat response with text' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VoiceChatDto]),
    __metadata("design:returntype", Promise)
], VoiceChatBotController.prototype, "voiceChat", null);
__decorate([
    Post('chat-stream'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Get voice chat response as base64 audio' }),
    ApiResponse({ status: 200, description: 'Base64 encoded audio data with text response' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VoiceChatDto]),
    __metadata("design:returntype", Promise)
], VoiceChatBotController.prototype, "voiceChatStream", null);
__decorate([
    Post('generate-audio'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Generate voice response (non-streaming)' }),
    ApiResponse({ status: 200, description: 'Voice response with audio data' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VoiceChatDto]),
    __metadata("design:returntype", Promise)
], VoiceChatBotController.prototype, "generateVoiceResponse", null);
__decorate([
    Post('text-to-voice'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Convert any text to voice (returns base64 audio data)' }),
    ApiResponse({ status: 200, description: 'Base64 encoded audio data' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TextToVoiceDto]),
    __metadata("design:returntype", Promise)
], VoiceChatBotController.prototype, "textToVoice", null);
__decorate([
    Post('speech-to-text'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Convert speech audio to text (transcription)' }),
    ApiResponse({ status: 200, description: 'Transcribed text from the audio' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SpeechToTextDto]),
    __metadata("design:returntype", Promise)
], VoiceChatBotController.prototype, "speechToText", null);
VoiceChatBotController = __decorate([
    ApiTags('Voice Chat Bot'),
    Controller('voice-chat-bot'),
    __metadata("design:paramtypes", [VoiceChatBotService])
], VoiceChatBotController);
export { VoiceChatBotController };
//# sourceMappingURL=voice-chat-bot.controller.js.map