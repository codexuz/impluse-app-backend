import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LessonSchedulesService } from './lesson-schedules.service.js';
import { LessonSchedulesController } from './lesson-schedules.controller.js';
import { LessonSchedule } from './entities/lesson-schedule.entity.js';
import { Group } from '../groups/entities/group.entity.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [
    SequelizeModule.forFeature([LessonSchedule, Group]),
    NotificationsModule,
  ],
  controllers: [LessonSchedulesController],
  providers: [LessonSchedulesService],
})
export class LessonSchedulesModule {}
