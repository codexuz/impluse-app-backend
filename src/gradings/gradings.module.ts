import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { GradingsService } from "./gradings.service.js";
import { GradingsController } from "./gradings.controller.js";
import { Grading } from "./entities/grading.entity.js";
import { TelegramBotModule } from '../telegram-bot/telegram-bot.module.js';

@Module({
  imports: [SequelizeModule.forFeature([Grading]), TelegramBotModule],
  controllers: [GradingsController],
  providers: [GradingsService],
  exports: [GradingsService],
})
export class GradingsModule {}
