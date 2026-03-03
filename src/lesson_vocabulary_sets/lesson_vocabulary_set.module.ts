import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LessonVocabularySetService } from './lesson_vocabulary_set.service.js';
import { LessonVocabularySetController } from './lesson_vocabulary_set.controller.js';
import { LessonVocabularySet } from './entities/lesson_vocabulary_set.entity.js';
import { VocabularyItemsModule } from '../vocabulary_items/vocabulary_items.module.js';
import { StudentVocabularyProgressModule } from '../student_vocabulary_progress/student-vocabulary-progress.module.js';

@Module({
  imports: [
    SequelizeModule.forFeature([LessonVocabularySet]),
    VocabularyItemsModule,
    StudentVocabularyProgressModule
  ],
  controllers: [LessonVocabularySetController],
  providers: [LessonVocabularySetService],
  exports: [LessonVocabularySetService]
})
export class LessonVocabularySetModule { }
