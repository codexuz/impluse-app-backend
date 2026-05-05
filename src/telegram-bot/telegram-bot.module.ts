import { Module, forwardRef } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { TelegramBotService } from "./telegram-bot.service.js";
import { TelegramBotController } from "./telegram-bot.controller.js";
import { StudentParent } from "../student-parents/entities/student_parents.entity.js";
import { StudentPayment } from "../student-payment/entities/student-payment.entity.js";
import { Attendance } from "../attendance/entities/attendance.entity.js";
import { Grading } from "../gradings/entities/grading.entity.js";
import { Exam } from "../exams/entities/exam.entity.js";
import { ExamResult } from "../exams/entities/exam_result.entity.js";
import { StudentProfile } from "../student_profiles/entities/student_profile.entity.js";
import { User } from "../users/entities/user.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { StudentPaymentModule } from "../student-payment/student-payment.module.js";
import { CoursesModule } from "../courses/courses.module.js";
import { TelegramChatModule } from "../telegram-chat/telegram-chat.module.js";

@Module({
  imports: [
    forwardRef(() => StudentPaymentModule),
    forwardRef(() => TelegramChatModule),
    CoursesModule,
    SequelizeModule.forFeature([
      StudentParent,
      StudentPayment,
      Attendance,
      Grading,
      Exam,
      ExamResult,
      StudentProfile,
      User,
      Group,
      GroupStudent,
    ]),
  ],
  controllers: [TelegramBotController],
  providers: [
    TelegramBotService,
    { provide: 'TELEGRAM_BOT_SERVICE', useExisting: TelegramBotService },
  ],
  exports: [TelegramBotService, 'TELEGRAM_BOT_SERVICE'],
})
export class TelegramBotModule {}
