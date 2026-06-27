import { Module } from '@nestjs/common';
import { GroupStudentsService } from './group-students.service.js';
import { GroupStudentsController } from './group-students.controller.js';
import { RetentionStatsService } from './retention-stats.service.js';
import { RetentionStatsController } from './retention-stats.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from '../groups/entities/group.entity.js';
import { GroupStudent } from './entities/group-student.entity.js';
import { GroupEnrollmentEvent } from './entities/group-enrollment-event.entity.js';
import { UserCourseModule } from '../user-course/user-course.module.js';

@Module({
  imports: [
    SequelizeModule.forFeature([Group, GroupStudent, GroupEnrollmentEvent]),
    UserCourseModule,
  ],
  controllers: [GroupStudentsController, RetentionStatsController],
  providers: [GroupStudentsService, RetentionStatsService],
  exports: [GroupStudentsService, RetentionStatsService],
})
export class GroupStudentsModule {}
