import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AttendanceBotService } from './attendance-bot.service.js';
import { AttendanceBotController } from './attendance-bot.controller.js';
import { StaffAttendanceModule } from '../staff-attendance/staff-attendance.module.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [
    StaffAttendanceModule,
    SequelizeModule.forFeature([User]),
  ],
  controllers: [AttendanceBotController],
  providers: [AttendanceBotService],
  exports: [AttendanceBotService],
})
export class AttendanceBotModule {}
