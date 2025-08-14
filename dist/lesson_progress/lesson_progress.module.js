var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LessonProgressService } from './lesson_progress.service.js';
import { LessonProgressController } from './lesson_progress.controller.js';
import { LessonProgress } from './entities/lesson_progress.entity.js';
import { HomeworkSubmission } from '../homework_submissions/entities/homework_submission.entity.js';
import { GroupHomework } from '../group_homeworks/entities/group_homework.entity.js';
import { Lesson } from '../lesson/entities/lesson.entity.js';
let LessonProgressModule = class LessonProgressModule {
};
LessonProgressModule = __decorate([
    Module({
        imports: [
            SequelizeModule.forFeature([
                LessonProgress,
                HomeworkSubmission,
                GroupHomework,
                Lesson
            ])
        ],
        controllers: [LessonProgressController],
        providers: [LessonProgressService],
        exports: [LessonProgressService]
    })
], LessonProgressModule);
export { LessonProgressModule };
//# sourceMappingURL=lesson_progress.module.js.map