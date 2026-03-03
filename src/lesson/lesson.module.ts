import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service.js';
import { LessonController } from './lesson.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Lesson } from './entities/lesson.entity.js';
import { GroupAssignedLesson } from '../group_assigned_lessons/entities/group_assigned_lesson.entity.js';
import { LessonVocabularySet } from '../lesson_vocabulary_sets/entities/lesson_vocabulary_set.entity.js';
@Module({
  imports: [
    SequelizeModule.forFeature([Lesson, GroupAssignedLesson, LessonVocabularySet]),
  ],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService],
})
export class LessonModule { }
