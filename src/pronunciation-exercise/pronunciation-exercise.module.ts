import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PronunciationExerciseService } from "./pronunciation-exercise.service.js";
import { PronunciationExerciseController } from "./pronunciation-exercise.controller.js";
import { PronunciationExercise } from "./entities/pronunciation-exercise.entity.js";
import { AwsStorageModule } from "../aws-storage/aws-storage.module.js";
import { VoiceChatBotModule } from "../services/voice-chat-bot/voice-chat-bot.module.js";

@Module({
  imports: [
    SequelizeModule.forFeature([PronunciationExercise]),
    AwsStorageModule,
    VoiceChatBotModule,
  ],
  controllers: [PronunciationExerciseController],
  providers: [PronunciationExerciseService],
  exports: [PronunciationExerciseService],
})
export class PronunciationExerciseModule {}
