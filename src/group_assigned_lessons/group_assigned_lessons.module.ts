import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupAssignedLessonsService } from './group_assigned_lessons.service.js';
import { GroupAssignedLessonsController } from './group_assigned_lessons.controller.js';
import { GroupAssignedLesson } from './entities/group_assigned_lesson.entity.js';

@Module({
  imports: [
    SequelizeModule.forFeature([GroupAssignedLesson])
  ],
  controllers: [GroupAssignedLessonsController],
  providers: [GroupAssignedLessonsService],
  exports: [GroupAssignedLessonsService]
})
export class GroupAssignedLessonsModule {}
