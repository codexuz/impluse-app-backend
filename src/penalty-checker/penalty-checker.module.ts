import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PenaltyCheckerService } from "./penalty-checker.service.js";
import { LessonSchedule } from "../lesson-schedules/entities/lesson-schedule.entity.js";
import { Attendance } from "../attendance/entities/attendance.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { BonusPenaltyTransaction } from "../bonus-penalty/entities/bonus-penalty-transaction.entity.js";
import { BonusPenaltyModule } from "../bonus-penalty/bonus-penalty.module.js";

@Module({
  imports: [
    SequelizeModule.forFeature([
      LessonSchedule,
      Attendance,
      Group,
      GroupStudent,
      BonusPenaltyTransaction,
    ]),
    BonusPenaltyModule,
  ],
  providers: [PenaltyCheckerService],
})
export class PenaltyCheckerModule {}
