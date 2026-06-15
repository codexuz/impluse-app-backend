import { Module } from "@nestjs/common";
import { HomeworkSubmissionsService } from "./homework_submissions.service.js";
import { HomeworkSubmissionsController } from "./homework_submissions.controller.js";
import { SequelizeModule } from "@nestjs/sequelize";
import { HomeworkSubmission } from "./entities/homework_submission.entity.js";
import { HomeworkSection } from "./entities/homework_sections.entity.js";
import { LessonProgressModule } from "../lesson_progress/lesson_progress.module.js";
import { SpeakingResponse } from "../speaking-response/entities/speaking-response.entity.js";
import { GroupStudentsModule } from "../group-students/group-students.module.js";
import { OpenaiService } from "../services/openai/openai.service.js";
import { GroupHomework } from "../group_homeworks/entities/group_homework.entity.js";
import { Lesson } from "../lesson/entities/lesson.entity.js";
import { Unit } from "../units/entities/units.entity.js";
import { Course } from "../courses/entities/course.entity.js";
import { Speaking } from "../speaking/entities/speaking.entity.js";
import { LessonProgress } from "../lesson_progress/entities/lesson_progress.entity.js";
import { User } from "../users/entities/user.entity.js";
import { StudentProfileModule } from "../student_profiles/student-profile.module.js";
import { NotificationsModule } from "../notifications/notifications.module.js";

@Module({
  imports: [
    SequelizeModule.forFeature([
      HomeworkSubmission,
      HomeworkSection,
      SpeakingResponse,
      GroupHomework,
      Lesson,
      Unit,
      Course,
      Speaking,
      LessonProgress,
      User,
    ]),
    LessonProgressModule,
    GroupStudentsModule,
    StudentProfileModule,
    NotificationsModule,
  ],
  controllers: [HomeworkSubmissionsController],
  providers: [HomeworkSubmissionsService, OpenaiService],
  exports: [HomeworkSubmissionsService],
})
export class HomeworkSubmissionsModule {}
