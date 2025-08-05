import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LessonProgressService } from './lesson_progress.service.js';
import { LessonProgressController } from './lesson_progress.controller.js';
import { LessonProgress } from './entities/lesson_progress.entity.js';

@Module({
  imports: [SequelizeModule.forFeature([LessonProgress])],
  controllers: [LessonProgressController],
  providers: [LessonProgressService],
  exports: [LessonProgressService]
})
export class LessonProgressModule {}
