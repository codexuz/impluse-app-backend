import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StaffAttendanceController } from './staff-attendance.controller.js';
import { StaffAttendanceService } from './staff-attendance.service.js';
import { StaffAttendance } from './entities/staff-attendance.entity.js';
import { AttendancePolicy } from './entities/attendance-policy.entity.js';
import { StaffAttendanceEvent } from './entities/staff-attendance-event.entity.js';
import { StaffProfileModule } from '../staff-profile/staff-profile.module.js';

@Module({
  imports: [
    SequelizeModule.forFeature([StaffAttendance, AttendancePolicy, StaffAttendanceEvent]),
    StaffProfileModule,
  ],
  controllers: [StaffAttendanceController],
  providers: [StaffAttendanceService],
  exports: [StaffAttendanceService],
})
export class StaffAttendanceModule {}
