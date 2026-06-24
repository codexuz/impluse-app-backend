import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SupportBotService } from "./support-bot.service.js";
import { SupportBotController } from "./support-bot.controller.js";
import { SupportAssignmentsModule } from "../support-assignments/support-assignments.module.js";
import { SupportAttendanceModule } from "../support-attendance/support-attendance.module.js";
import { GroupStudentsModule } from "../group-students/group-students.module.js";
import { User } from "../users/entities/user.entity.js";

@Module({
  imports: [
    SupportAssignmentsModule,
    SupportAttendanceModule,
    GroupStudentsModule,
    SequelizeModule.forFeature([User]),
  ],
  controllers: [SupportBotController],
  providers: [SupportBotService],
  exports: [SupportBotService],
})
export class SupportBotModule {}
