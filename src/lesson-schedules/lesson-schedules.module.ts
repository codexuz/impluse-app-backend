import { Module } from '@nestjs/common';
import { LessonSchedulesService } from './lesson-schedules.service.js';
import { LessonSchedulesController } from './lesson-schedules.controller.js';

@Module({
  controllers: [LessonSchedulesController],
  providers: [LessonSchedulesService],
})
export class LessonSchedulesModule {}
