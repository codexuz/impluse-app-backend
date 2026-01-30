import { Module } from "@nestjs/common";
import { Ieltspart1QuestionService } from "./ieltspart1-question.service.js";
import { Ieltspart1QuestionController } from "./ieltspart1-question.controller.js";
import { SequelizeModule } from "@nestjs/sequelize";
import { Ieltspart1Question } from "./entities/ieltspart1-question.entity.js";
import { AwsStorageModule } from "../aws-storage/aws-storage.module.js";
import { VoiceChatBotModule } from "../services/voice-chat-bot/voice-chat-bot.module.js";

@Module({
  imports: [
    SequelizeModule.forFeature([Ieltspart1Question]),
    AwsStorageModule,
    VoiceChatBotModule,
  ],
  controllers: [Ieltspart1QuestionController],
  providers: [Ieltspart1QuestionService],
  exports: [Ieltspart1QuestionService],
})
export class Ieltspart1QuestionModule {}
