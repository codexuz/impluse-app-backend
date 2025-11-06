var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { VoiceChatBotService } from './voice-chat-bot.service.js';
import { VoiceChatBotController } from './voice-chat-bot.controller.js';
import { VoiceChatBotGateway } from './voice-chat-bot.gateway.js';
import { OpenaiModule } from '../openai/openai.module.js';
import { SpeechifyModule } from '../speechify/speechify.module.js';
import { DeepgramModule } from '../deepgram/deepgram.module.js';
let VoiceChatBotModule = class VoiceChatBotModule {
};
VoiceChatBotModule = __decorate([
    Module({
        imports: [OpenaiModule, SpeechifyModule, DeepgramModule],
        controllers: [VoiceChatBotController],
        providers: [VoiceChatBotService, VoiceChatBotGateway],
        exports: [VoiceChatBotService, VoiceChatBotGateway],
    })
], VoiceChatBotModule);
export { VoiceChatBotModule };
//# sourceMappingURL=voice-chat-bot.module.js.map