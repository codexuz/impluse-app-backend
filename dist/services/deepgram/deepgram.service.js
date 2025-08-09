var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@nestjs/common";
import { createClient } from "@deepgram/sdk";
import { ConfigService } from "@nestjs/config";
let DeepgramService = class DeepgramService {
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get("DEEPGRAM_API_KEY");
        this.deepgram = createClient(apiKey);
    }
    async transcribeRemoteAudio(audioUrl) {
        const { result, error } = await this.deepgram.listen.prerecorded.transcribeUrl({
            url: audioUrl,
        }, {
            smart_format: true,
            filler_words: true,
            model: "nova-3",
        });
        if (error)
            throw error;
        return result;
    }
    async transcribeLocalAudio(audioFile) {
        const { result, error } = await this.deepgram.listen.prerecorded.transcribeFile(audioFile, {
            smart_format: true,
            filler_words: true,
            model: "nova-3",
        });
        if (error)
            throw error;
        return result;
    }
    async transcribeBuffer(audioBuffer, mimetype = 'audio/mpeg') {
        try {
            const { result, error } = await this.deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
                smart_format: true,
                filler_words: true,
                model: "nova-3",
                mimetype: mimetype,
            });
            if (error)
                throw error;
            return result;
        }
        catch (error) {
            throw new Error(`Failed to transcribe audio buffer: ${error.message}`);
        }
    }
};
DeepgramService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], DeepgramService);
export { DeepgramService };
//# sourceMappingURL=deepgram.service.js.map