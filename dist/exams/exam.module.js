var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Exam } from './entities/exam.entity.js';
import { GroupStudent } from '../group-students/entities/group-student.entity.js';
import { ExamService } from './exam.service.js';
import { ExamController } from './exam.controller.js';
let ExamModule = class ExamModule {
};
ExamModule = __decorate([
    Module({
        imports: [SequelizeModule.forFeature([Exam, GroupStudent])],
        controllers: [ExamController],
        providers: [ExamService],
        exports: [ExamService, SequelizeModule],
    })
], ExamModule);
export { ExamModule };
//# sourceMappingURL=exam.module.js.map