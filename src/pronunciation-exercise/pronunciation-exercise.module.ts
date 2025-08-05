import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PronunciationExerciseService } from './pronunciation-exercise.service.js';
import { PronunciationExerciseController } from './pronunciation-exercise.controller.js';
import { PronunciationExercise } from './entities/pronunciation-exercise.entity.js';

@Module({
  imports: [
    SequelizeModule.forFeature([PronunciationExercise])
  ],
  controllers: [PronunciationExerciseController],
  providers: [PronunciationExerciseService],
  exports: [PronunciationExerciseService]
})
export class PronunciationExerciseModule {}
