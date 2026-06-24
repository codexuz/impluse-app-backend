import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SupportAttendanceService } from "./support-attendance.service.js";
import { SupportAttendanceController } from "./support-attendance.controller.js";
import { SupportAttendance } from "./entities/support-attendance.entity.js";

@Module({
  imports: [SequelizeModule.forFeature([SupportAttendance])],
  controllers: [SupportAttendanceController],
  providers: [SupportAttendanceService],
  exports: [SupportAttendanceService],
})
export class SupportAttendanceModule {}
