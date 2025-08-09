import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Exam } from './entities/exam.entity.js';
import { GroupStudent } from '../group-students/entities/group-student.entity.js';
import { ExamService } from './exam.service.js';
import { ExamController } from './exam.controller.js';

@Module({
  imports: [SequelizeModule.forFeature([Exam, GroupStudent])],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService, SequelizeModule],
})
export class ExamModule {}
