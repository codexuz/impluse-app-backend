import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { TelegramBotService } from "./telegram-bot.service.js";
import { TelegramBotController } from "./telegram-bot.controller.js";
import { StudentParent } from "../student-parents/entities/student_parents.entity.js";
import { StudentPayment } from "../student-payment/entities/student-payment.entity.js";
import { Attendance } from "../attendance/entities/attendance.entity.js";
import { Grading } from "../gradings/entities/grading.entity.js";
import { Exam } from "../exams/entities/exam.entity.js";
import { ExamResult } from "../exams/entities/exam_result.entity.js";
import { LessonProgress } from "../lesson_progress/entities/lesson_progress.entity.js";
import { StudentProfile } from "../student_profiles/entities/student_profile.entity.js";
import { User } from "../users/entities/user.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { StudentWallet } from "../student-wallet/entities/student-wallet.entity.js";

@Module({
  imports: [
    SequelizeModule.forFeature([
      StudentParent,
      StudentPayment,
      Attendance,
      Grading,
      Exam,
      ExamResult,
      LessonProgress,
      StudentProfile,
      User,
      Group,
      GroupStudent,
      StudentWallet,
    ]),
  ],
  controllers: [TelegramBotController],
  providers: [TelegramBotService],
  exports: [TelegramBotService],
})
export class TelegramBotModule {}
