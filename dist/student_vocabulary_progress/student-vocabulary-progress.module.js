var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentVocabularyProgress } from './entities/student_vocabulary_progress.entity.js';
import { StudentVocabularyProgressService } from './student-vocabulary-progress.service.js';
import { StudentVocabularyProgressController } from './student-vocabulary-progress.controller.js';
let StudentVocabularyProgressModule = class StudentVocabularyProgressModule {
};
StudentVocabularyProgressModule = __decorate([
    Module({
        imports: [SequelizeModule.forFeature([StudentVocabularyProgress])],
        controllers: [StudentVocabularyProgressController],
        providers: [StudentVocabularyProgressService],
        exports: [StudentVocabularyProgressService],
    })
], StudentVocabularyProgressModule);
export { StudentVocabularyProgressModule };
//# sourceMappingURL=student-vocabulary-progress.module.js.map