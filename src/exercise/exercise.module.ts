import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExerciseService } from './exercise.service.js';
import { ExerciseController } from './exercise.controller.js';
import { Exercise } from './entities/exercise.entity.js';
import { Choices } from './entities/choices.js';
import { GapFilling } from './entities/gap_filling.js';
import { MatchingExercise } from './entities/matching_pairs.js';
import { TypingExercise } from './entities/typing_answers.js';
import { Questions } from './entities/questions.js';
import { SentenceBuild } from './entities/sentence_build.js';
import { Translation } from './entities/translation.js';
import { Dictation } from './entities/dictation.js';
import { ListenAndChoose } from './entities/listen_and_choose.js';
import { HomeworkSubmissionsModule } from "../homework_submissions/homework_submissions.module.js";

@Module({
  imports: [
    SequelizeModule.forFeature([
      Exercise,
      Questions,
      SentenceBuild,
      Translation,
      Dictation,
      ListenAndChoose,
      Choices,
      GapFilling,
      MatchingExercise,
      TypingExercise
    ]),
    HomeworkSubmissionsModule
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService],
  exports: [ExerciseService]
})
export class ExerciseModule {}
