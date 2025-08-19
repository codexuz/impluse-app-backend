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
import { SpeechifyClient } from "@speechify/api";
import { ConfigService } from '@nestjs/config';
let SpeechifyService = class SpeechifyService {
    constructor(configService) {
        this.configService = configService;
        this.client = new SpeechifyClient({
            token: this.configService.get('speechifyToken'),
        });
    }
    async streamTexttoSpeech(text, voice) {
        try {
            const stream = await this.client.tts.audio.stream({
                accept: "audio/mpeg",
                input: text,
                voiceId: voice
            });
            const chunks = [];
            for await (const chunk of stream) {
                chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
            }
            const audioBuffer = Buffer.concat(chunks);
            const base64Audio = `data:audio/mpeg;base64,${audioBuffer.toString("base64")}`;
            return base64Audio;
        }
        catch (error) {
            throw new Error(`Failed to convert text to speech: ${error.message}`);
        }
    }
    async generateTexttoSpeech(text, voice) {
        try {
            return await this.client.tts.audio.speech({
                input: text,
                voiceId: voice
            });
        }
        catch (error) {
            throw new Error(`Failed to convert text to speech: ${error.message}`);
        }
    }
};
SpeechifyService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], SpeechifyService);
export { SpeechifyService };
//# sourceMappingURL=speechify.service.js.map