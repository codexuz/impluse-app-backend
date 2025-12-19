import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Exam } from "./entities/exam.entity.js";
import { ExamResult } from "./entities/exam_result.entity.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { User } from "../users/entities/user.entity.js";
import { ExamService } from "./exam.service.js";
import { ExamController } from "./exam.controller.js";
import { ExamResultsService } from "./exam-results.service.js";
import { ExamResultsController } from "./exam-results.controller.js";

@Module({
  imports: [
    SequelizeModule.forFeature([Exam, GroupStudent, Group, ExamResult, User]),
  ],
  controllers: [ExamController, ExamResultsController],
  providers: [ExamService, ExamResultsService],
  exports: [ExamService, ExamResultsService, SequelizeModule],
})
export class ExamModule {}
