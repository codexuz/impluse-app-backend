import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service.js';
import { CoursesController } from './courses.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Course } from './entities/course.entity.js'; 
import { User } from '../users/entities/user.entity.js';
import { LessonProgress } from '../lesson_progress/entities/lesson_progress.entity.js';
@Module({
  imports: [
    SequelizeModule.forFeature([Course, User, LessonProgress]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService, SequelizeModule],
})
export class CoursesModule {}
