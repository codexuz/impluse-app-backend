import { Module } from '@nestjs/common';
import { VoiceChatBotService } from './voice-chat-bot.service.js';
import { VoiceChatBotController } from './voice-chat-bot.controller.js';
import { VoiceChatBotGateway } from './voice-chat-bot.gateway.js';
import { OpenaiModule } from '../openai/openai.module.js';
import { SpeechifyModule } from '../speechify/speechify.module.js';
import { DeepgramModule } from '../deepgram/deepgram.module.js';

@Module({
  imports: [OpenaiModule, SpeechifyModule, DeepgramModule],
  controllers: [VoiceChatBotController],
  providers: [VoiceChatBotService, VoiceChatBotGateway],
  exports: [VoiceChatBotService, VoiceChatBotGateway],
})
export class VoiceChatBotModule {}
