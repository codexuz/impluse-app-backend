var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LessonVocabularySetService } from './lesson_vocabulary_set.service.js';
import { LessonVocabularySetController } from './lesson_vocabulary_set.controller.js';
import { LessonVocabularySet } from './entities/lesson_vocabulary_set.entity.js';
import { VocabularyItemsModule } from '../vocabulary_items/vocabulary_items.module.js';
let LessonVocabularySetModule = class LessonVocabularySetModule {
};
LessonVocabularySetModule = __decorate([
    Module({
        imports: [
            SequelizeModule.forFeature([LessonVocabularySet]),
            VocabularyItemsModule
        ],
        controllers: [LessonVocabularySetController],
        providers: [LessonVocabularySetService],
        exports: [LessonVocabularySetService]
    })
], LessonVocabularySetModule);
export { LessonVocabularySetModule };
//# sourceMappingURL=lesson_vocabulary_set.module.js.map