import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service.js';
import { LessonController } from './lesson.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Lesson } from './entities/lesson.entity.js'; 
import { GroupAssignedLesson } from '../group_assigned_lessons/entities/group_assigned_lesson.entity.js';
@Module({
  imports: [
    SequelizeModule.forFeature([Lesson, GroupAssignedLesson]),
  ],  
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService], 
})
export class LessonModule {}
