var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Exam } from './entities/exam.entity.js';
import { ExamResult } from './entities/exam_result.entity.js';
import { GroupStudent } from '../group-students/entities/group-student.entity.js';
import { ExamService } from './exam.service.js';
import { ExamController } from './exam.controller.js';
import { ExamResultsService } from './exam-results.service.js';
import { ExamResultsController } from './exam-results.controller.js';
let ExamModule = class ExamModule {
};
ExamModule = __decorate([
    Module({
        imports: [SequelizeModule.forFeature([Exam, GroupStudent, ExamResult])],
        controllers: [ExamController, ExamResultsController],
        providers: [ExamService, ExamResultsService],
        exports: [ExamService, ExamResultsService, SequelizeModule],
    })
], ExamModule);
export { ExamModule };
//# sourceMappingURL=exam.module.js.map