import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupAssignedUnitsService } from './group_assigned_units.service.js';
import { GroupAssignedUnitsController } from './group_assigned_units.controller.js';
import { GroupAssignedUnit } from './entities/group_assigned_unit.entity.js';
import { LessonModule } from '../lesson/lesson.module.js';
import { GroupAssignedLessonsModule } from '../group_assigned_lessons/group_assigned_lessons.module.js';
import { GroupHomeworksModule } from '../group_homeworks/group_homeworks.module.js';

@Module({
  imports: [
    SequelizeModule.forFeature([GroupAssignedUnit]),
    LessonModule,
    GroupAssignedLessonsModule,
    GroupHomeworksModule
  ],
  controllers: [GroupAssignedUnitsController],
  providers: [GroupAssignedUnitsService],
  exports: [GroupAssignedUnitsService]
})
export class GroupAssignedUnitsModule {}
