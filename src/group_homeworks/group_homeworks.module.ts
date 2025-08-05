import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupHomeworksService } from './group_homeworks.service.js';
import { GroupHomeworksController } from './group_homeworks.controller.js';
import { GroupHomework } from './entities/group_homework.entity.js';
import { GroupStudent } from '../group-students/entities/group-student.entity.js';
import { Lesson } from '../lesson/entities/lesson.entity.js';
import { Exercise } from '../exercise/entities/exercise.entity.js';
import { Speaking } from '../speaking/entities/speaking.entity.js';
import { LessonContent } from '../lesson-content/entities/lesson-content.entity.js';
import { LessonVocabularySet } from '../lesson_vocabulary_sets/entities/lesson_vocabulary_set.entity.js';

@Module({
  imports: [
    SequelizeModule.forFeature([GroupHomework, GroupStudent, Lesson, Exercise, Speaking, LessonContent, LessonVocabularySet])
  ],
  controllers: [GroupHomeworksController],
  providers: [GroupHomeworksService],
  exports: [GroupHomeworksService]
})
export class GroupHomeworksModule {}
