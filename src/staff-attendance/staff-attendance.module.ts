import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StaffAttendanceController } from './staff-attendance.controller.js';
import { StaffAttendanceService } from './staff-attendance.service.js';
import { StaffAttendance } from './entities/staff-attendance.entity.js';

@Module({
  imports: [SequelizeModule.forFeature([StaffAttendance])],
  controllers: [StaffAttendanceController],
  providers: [StaffAttendanceService],
  exports: [StaffAttendanceService],
})
export class StaffAttendanceModule {}
