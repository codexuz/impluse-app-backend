import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AttendanceService } from "./attendance.service.js";
import { AttendanceController } from "./attendance.controller.js";
import { Attendance } from "./entities/attendance.entity.js";
import { AttendanceLog } from "./entities/attendance-log.entity.js";
import { TeacherProfile } from "../teacher-profile/entities/teacher-profile.entity.js";
import { TeacherWallet } from "../teacher-wallet/entities/teacher-wallet.entity.js";
import { TeacherTransaction } from "../teacher-transaction/entities/teacher-transaction.entity.js";
import { CompensateLessonsModule } from "../compensate-lessons/compensate-lessons.module.js";

@Module({
  imports: [
    SequelizeModule.forFeature([
      Attendance,
      AttendanceLog,
      TeacherProfile,
      TeacherWallet,
      TeacherTransaction,
    ]),
    CompensateLessonsModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
