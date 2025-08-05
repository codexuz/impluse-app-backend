import { Module } from '@nestjs/common';
import { UserCourseService } from './user-course.service.js';
import { UserCourseController } from './user-course.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserCourse } from './entities/user-course.entity.js';

@Module({
  imports: [
    SequelizeModule.forFeature([UserCourse]),
  ],
  controllers: [UserCourseController],
  providers: [UserCourseService],
  exports: [UserCourseService, SequelizeModule],
  // If you have any other modules that need to use UserCourseService, you can export
})
export class UserCourseModule {}
