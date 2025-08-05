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
@Module({
  imports: [
    SequelizeModule.forFeature([
      Exercise,
      Questions,
      SentenceBuild,
      Choices,
      GapFilling,
      MatchingExercise,
      TypingExercise
    ])
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService],
  exports: [ExerciseService]
})
export class ExerciseModule {}
