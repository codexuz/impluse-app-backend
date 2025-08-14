import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LessonVocabularySetService } from './lesson_vocabulary_set.service.js';
import { LessonVocabularySetController } from './lesson_vocabulary_set.controller.js';
import { LessonVocabularySet } from './entities/lesson_vocabulary_set.entity.js';

@Module({
  imports: [
    SequelizeModule.forFeature([LessonVocabularySet])
  ],
  controllers: [LessonVocabularySetController],
  providers: [LessonVocabularySetService],
  exports: [LessonVocabularySetService]
})
export class LessonVocabularySetModule {}
