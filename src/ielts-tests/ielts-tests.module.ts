import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { JwtModule } from "@nestjs/jwt";
import type { StringValue } from "ms";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { IeltsTestsService } from "./ielts-tests.service.js";
import { IeltsTestsController } from "./ielts-tests.controller.js";
import { IeltsReadingController } from "./ielts-reading.controller.js";
import { IeltsReadingPartsController } from "./ielts-reading-parts.controller.js";
import { IeltsListeningController } from "./ielts-listening.controller.js";
import { IeltsListeningPartsController } from "./ielts-listening-parts.controller.js";
import { IeltsWritingController } from "./ielts-writing.controller.js";
import { IeltsQuestionsController } from "./ielts-questions.controller.js";
import { IeltsQuestionChoicesController } from "./ielts-question-choices.controller.js";
import { IeltsSubQuestionsController } from "./ielts-multiple-choice-questions.controller.js";
import { IeltsTest } from "./entities/ielts-test.entity.js";
import { IeltsReading } from "./entities/ielts-reading.entity.js";
import { IeltsReadingPart } from "./entities/ielts-reading-part.entity.js";
import { IeltsListening } from "./entities/ielts-listening.entity.js";
import { IeltsListeningPart } from "./entities/ielts-listening-part.entity.js";
import { IeltsWriting } from "./entities/ielts-writing.entity.js";
import { IeltsWritingTask } from "./entities/ielts-writing-task.entity.js";
import { IeltsQuestion } from "./entities/ielts-question.entity.js";
import { IeltsQuestionOption } from "./entities/ielts-question-option.entity.js";
import { IeltsSubQuestion } from "./entities/ielts-multiple-choice-question.entity.js";
import { IeltsAnswerAttempt } from "./entities/ielts-answer-attempt.entity.js";
import { IeltsReadingAnswer } from "./entities/ielts-reading-answer.entity.js";
import { IeltsListeningAnswer } from "./entities/ielts-listening-answer.entity.js";
import { IeltsWritingAnswer } from "./entities/ielts-writing-answer.entity.js";
import { IeltsAnswersService } from "./ielts-answers.service.js";
import { IeltsAnswersController } from "./ielts-answers.controller.js";
import { IeltsMockTest } from "./entities/ielts-mock-test.entity.js";
import { IeltsMockTestsService } from "./ielts-mock-tests.service.js";
import { IeltsMockTestsController } from "./ielts-mock-tests.controller.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { IeltsReadingReadingPart } from "./entities/ielts-reading-reading-part.entity.js";
import { IeltsListeningListeningPart } from "./entities/ielts-listening-listening-part.entity.js";
import { IeltsWritingWritingTask } from "./entities/ielts-writing-writing-task.entity.js";
import { IeltsSpeaking } from "./entities/ielts-speaking.entity.js";
import { IeltsSpeakingPart } from "./entities/ielts-speaking-part.entity.js";
import { IeltsSpeakingQuestion } from "./entities/ielts-speaking-question.entity.js";
import { IeltsSpeakingAttempt } from "./entities/ielts-speaking-attempt.entity.js";
import { IeltsSpeakingService } from "./ielts-speaking.service.js";
import { IeltsSpeakingController } from "./ielts-speaking.controller.js";
import { IeltsSpeakingRealtimeService } from "./ielts-speaking-realtime.service.js";
import { IeltsSpeakingGateway } from "./ielts-speaking.gateway.js";
import { OpenaiModule } from "../services/openai/openai.module.js";

@Module({
  imports: [
    ConfigModule,
    OpenaiModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET") || "your-secret-key",
        signOptions: {
          expiresIn: (configService.get<string>("JWT_EXPIRY") ||
            "1h") as StringValue,
        },
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([
      IeltsTest,
      IeltsReading,
      IeltsReadingPart,
      IeltsListening,
      IeltsListeningPart,
      IeltsWriting,
      IeltsWritingTask,
      IeltsQuestion,
      IeltsQuestionOption,
      IeltsSubQuestion,
      IeltsAnswerAttempt,
      IeltsReadingAnswer,
      IeltsListeningAnswer,
      IeltsWritingAnswer,
      IeltsMockTest,
      GroupStudent,
      Group,
      IeltsReadingReadingPart,
      IeltsListeningListeningPart,
      IeltsWritingWritingTask,
      IeltsSpeaking,
      IeltsSpeakingPart,
      IeltsSpeakingQuestion,
      IeltsSpeakingAttempt,
    ]),
  ],
  controllers: [
    IeltsTestsController,
    IeltsReadingController,
    IeltsReadingPartsController,
    IeltsListeningController,
    IeltsListeningPartsController,
    IeltsWritingController,
    IeltsAnswersController,
    IeltsQuestionsController,
    IeltsQuestionChoicesController,
    IeltsSubQuestionsController,
    IeltsMockTestsController,
    IeltsSpeakingController,
  ],
  providers: [
    IeltsTestsService,
    IeltsAnswersService,
    IeltsMockTestsService,
    IeltsSpeakingService,
    IeltsSpeakingRealtimeService,
    IeltsSpeakingGateway,
  ],
  exports: [IeltsTestsService, IeltsAnswersService, IeltsMockTestsService],
})
export class IeltsTestsModule { }
