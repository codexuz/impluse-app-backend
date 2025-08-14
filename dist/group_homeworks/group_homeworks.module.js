var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupHomeworksService } from './group_homeworks.service.js';
import { GroupHomeworksController } from './group_homeworks.controller.js';
import { GroupHomework } from './entities/group_homework.entity.js';
import { GroupStudent } from '../group-students/entities/group-student.entity.js';
import { Lesson } from '../lesson/entities/lesson.entity.js';
import { Exercise } from '../exercise/entities/exercise.entity.js';
import { Speaking } from '../speaking/entities/speaking.entity.js';
import { LessonContent } from '../lesson-content/entities/lesson-content.entity.js';
import { LessonVocabularySet } from '../lesson_vocabulary_sets/entities/lesson_vocabulary_set.entity.js';
import { HomeworkSubmission } from '../homework_submissions/entities/homework_submission.entity.js';
let GroupHomeworksModule = class GroupHomeworksModule {
};
GroupHomeworksModule = __decorate([
    Module({
        imports: [
            SequelizeModule.forFeature([GroupHomework, GroupStudent, Lesson, Exercise, Speaking, LessonContent, LessonVocabularySet, HomeworkSubmission])
        ],
        controllers: [GroupHomeworksController],
        providers: [GroupHomeworksService],
        exports: [GroupHomeworksService]
    })
], GroupHomeworksModule);
export { GroupHomeworksModule };
//# sourceMappingURL=group_homeworks.module.js.map