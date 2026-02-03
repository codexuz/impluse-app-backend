import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { IeltsTestsService } from "./ielts-tests.service.js";
import { IeltsTestsController } from "./ielts-tests.controller.js";
import { IeltsTest } from "./entities/ielts-test.entity.js";
import { IeltsReading } from "./entities/ielts-reading.entity.js";
import { IeltsReadingPart } from "./entities/ielts-reading-part.entity.js";
import { IeltsListening } from "./entities/ielts-listening.entity.js";
import { IeltsListeningPart } from "./entities/ielts-listening-part.entity.js";
import { IeltsWriting } from "./entities/ielts-writing.entity.js";
import { IeltsWritingTask } from "./entities/ielts-writing-task.entity.js";
import { IeltsAudio } from "./entities/ielts-audio.entity.js";
import { IeltsQuestion } from "./entities/ielts-question.entity.js";
import { IeltsQuestionContent } from "./entities/ielts-question-content.entity.js";
import { IeltsQuestionOption } from "./entities/ielts-question-option.entity.js";
import { IeltsMultipleChoiceQuestion } from "./entities/ielts-multiple-choice-question.entity.js";
import { IeltsMultipleChoiceOption } from "./entities/ielts-multiple-choice-option.entity.js";

@Module({
  imports: [
    SequelizeModule.forFeature([
      IeltsTest,
      IeltsReading,
      IeltsReadingPart,
      IeltsListening,
      IeltsListeningPart,
      IeltsWriting,
      IeltsWritingTask,
      IeltsAudio,
      IeltsQuestion,
      IeltsQuestionContent,
      IeltsQuestionOption,
      IeltsMultipleChoiceQuestion,
      IeltsMultipleChoiceOption,
    ]),
  ],
  controllers: [IeltsTestsController],
  providers: [IeltsTestsService],
  exports: [IeltsTestsService],
})
export class IeltsTestsModule {}
