import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LessonProgressService } from './lesson_progress.service.js';
import { LessonProgressController } from './lesson_progress.controller.js';
import { LessonProgress } from './entities/lesson_progress.entity.js';
import { HomeworkSubmission } from '../homework_submissions/entities/homework_submission.entity.js';
import { GroupHomework } from '../group_homeworks/entities/group_homework.entity.js';
import { Lesson } from '../lesson/entities/lesson.entity.js';

@Module({
  imports: [
    SequelizeModule.forFeature([
      LessonProgress,
      HomeworkSubmission,
      GroupHomework,
      Lesson
    ])
  ],
  controllers: [LessonProgressController],
  providers: [LessonProgressService],
  exports: [LessonProgressService]
})
export class LessonProgressModule {}
