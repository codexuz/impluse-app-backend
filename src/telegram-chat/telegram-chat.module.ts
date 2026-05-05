import { Module, forwardRef } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { TelegramChatService } from "./telegram-chat.service.js";
import { TelegramChatController } from "./telegram-chat.controller.js";
import { TelegramChatMessage } from "./entities/telegram-chat-message.entity.js";
import { StudentParent } from "../student-parents/entities/student_parents.entity.js";
import { TelegramBotModule } from "../telegram-bot/telegram-bot.module.js";

@Module({
  imports: [
    forwardRef(() => TelegramBotModule),
    SequelizeModule.forFeature([TelegramChatMessage, StudentParent]),
  ],
  controllers: [TelegramChatController],
  providers: [TelegramChatService],
  exports: [TelegramChatService],
})
export class TelegramChatModule {}
