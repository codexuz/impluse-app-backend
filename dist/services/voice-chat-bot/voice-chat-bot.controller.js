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
import { Controller, Post, Body, HttpCode, HttpStatus, Res, Header, } from '@nestjs/common';
import { VoiceChatBotService } from './voice-chat-bot.service.js';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
class VoiceChatDto {
}
class TextToVoiceDto {
}
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
    async voiceChatStream(voiceChatDto, res) {
        try {
            const result = await this.voiceChatBotService.processVoiceChat(voiceChatDto.text, voiceChatDto.voice);
            res.set({
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'inline; filename="response.mp3"',
                'Cache-Control': 'no-cache',
            });
            result.audioStream.pipe(res);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async generateVoiceResponse(voiceChatDto) {
        return await this.voiceChatBotService.generateVoiceResponse(voiceChatDto.text, voiceChatDto.voice);
    }
    async textToVoice(textToVoiceDto, res) {
        try {
            const audioStream = await this.voiceChatBotService.textToVoice(textToVoiceDto.text, textToVoiceDto.voice);
            res.set({
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'inline; filename="text-to-speech.mp3"',
                'Cache-Control': 'no-cache',
            });
            audioStream.pipe(res);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
__decorate([
    Post('chat'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Process voice chat - returns both text and audio response' }),
    ApiResponse({ status: 200, description: 'Voice chat response with text and audio' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VoiceChatDto]),
    __metadata("design:returntype", Promise)
], VoiceChatBotController.prototype, "voiceChat", null);
__decorate([
    Post('chat-stream'),
    Header('Content-Type', 'audio/mpeg'),
    ApiOperation({ summary: 'Get voice chat response as audio stream' }),
    ApiResponse({ status: 200, description: 'Audio stream response' }),
    __param(0, Body()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VoiceChatDto, Object]),
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
    Header('Content-Type', 'audio/mpeg'),
    ApiOperation({ summary: 'Convert any text to voice (no AI processing)' }),
    ApiResponse({ status: 200, description: 'Audio stream of the input text' }),
    __param(0, Body()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TextToVoiceDto, Object]),
    __metadata("design:returntype", Promise)
], VoiceChatBotController.prototype, "textToVoice", null);
VoiceChatBotController = __decorate([
    ApiTags('Voice Chat Bot'),
    Controller('voice-chat-bot'),
    __metadata("design:paramtypes", [VoiceChatBotService])
], VoiceChatBotController);
export { VoiceChatBotController };
//# sourceMappingURL=voice-chat-bot.controller.js.map