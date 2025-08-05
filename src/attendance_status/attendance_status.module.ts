import { Module } from '@nestjs/common';
import { AttendanceStatusService } from './attendance_status.service.js';
import { AttendanceStatusController } from './attendance_status.controller.js';

@Module({
  controllers: [AttendanceStatusController],
  providers: [AttendanceStatusService],
})
export class AttendanceStatusModule {}
