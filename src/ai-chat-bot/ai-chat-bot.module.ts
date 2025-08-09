import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AiChatBotService } from './ai-chat-bot.service.js';
import { AiChatBotController } from './ai-chat-bot.controller.js';
import { chatHistory } from './entities/ai-chat-bot.entity.js';
import { DeepseekModule } from '../services/deepseek/deepseek.module.js';

@Module({
  imports: [
    SequelizeModule.forFeature([chatHistory]),
    DeepseekModule, // Import DeepseekModule to use its exported service
  ],
  controllers: [AiChatBotController],
  providers: [AiChatBotService],
})
export class AiChatBotModule {}
