import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SupportSchedulesService } from './support-schedules.service.js';
import { SupportSchedulesController } from './support-schedules.controller.js';
import { SupportSchedule } from './entities/support-schedule.entity.js';

@Module({
  imports: [SequelizeModule.forFeature([SupportSchedule])],
  controllers: [SupportSchedulesController],
  providers: [SupportSchedulesService],
  exports: [SupportSchedulesService],
})
export class SupportSchedulesModule {}
