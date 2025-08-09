var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service.js';
import { SpeechifyService } from '../speechify/speechify.service.js';
import { DeepgramService } from '../deepgram/deepgram.service.js';
let VoiceChatBotService = class VoiceChatBotService {
    constructor(openaiService, speechifyService, deepgramService) {
        this.openaiService = openaiService;
        this.speechifyService = speechifyService;
        this.deepgramService = deepgramService;
    }
    async processVoiceChat(text, voice = 'lauren') {
        try {
            const textResponse = await this.openaiService.agentBotChat(text);
            console.log('Input:', text, 'Response:', textResponse);
            const audioStream = await this.speechifyService.streamTexttoSpeech(textResponse, voice);
            return {
                textResponse,
                audioStream: audioStream
            };
        }
        catch (error) {
            throw new Error(`Voice chat bot error: ${error.message}`);
        }
    }
    async generateVoiceResponse(text, voice = 'lauren') {
        try {
            const textResponse = await this.openaiService.agentBotChat(text);
            const audioData = await this.speechifyService.generateTexttoSpeech(textResponse, voice);
            return {
                textResponse,
                audioData
            };
        }
        catch (error) {
            throw new Error(`Voice response generation error: ${error.message}`);
        }
    }
    async textToVoice(text, voice = 'lauren') {
        try {
            return await this.speechifyService.streamTexttoSpeech(text, voice);
        }
        catch (error) {
            throw new Error(`Text to voice conversion error: ${error.message}`);
        }
    }
    async speechToText(audioBuffer, mimeType = 'audio/mpeg') {
        try {
            const transcription = await this.deepgramService.transcribeBuffer(audioBuffer, mimeType);
            const transcribedText = transcription?.results?.channels[0]?.alternatives[0]?.transcript || '';
            return transcribedText;
        }
        catch (error) {
            throw new Error(`Speech to text conversion error: ${error.message}`);
        }
    }
};
VoiceChatBotService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [OpenaiService,
        SpeechifyService,
        DeepgramService])
], VoiceChatBotService);
export { VoiceChatBotService };
//# sourceMappingURL=voice-chat-bot.service.js.map