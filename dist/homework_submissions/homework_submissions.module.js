var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { HomeworkSubmissionsService } from './homework_submissions.service.js';
import { HomeworkSubmissionsController } from './homework_submissions.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { HomeworkSubmission } from './entities/homework_submission.entity.js';
import { LessonProgressModule } from '../lesson_progress/lesson_progress.module.js';
let HomeworkSubmissionsModule = class HomeworkSubmissionsModule {
};
HomeworkSubmissionsModule = __decorate([
    Module({
        imports: [
            SequelizeModule.forFeature([HomeworkSubmission]),
            LessonProgressModule
        ],
        controllers: [HomeworkSubmissionsController],
        providers: [HomeworkSubmissionsService],
        exports: [HomeworkSubmissionsService],
    })
], HomeworkSubmissionsModule);
export { HomeworkSubmissionsModule };
//# sourceMappingURL=homework_submissions.module.js.map