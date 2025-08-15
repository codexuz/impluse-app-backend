var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UnitVocabularySetService } from './unit-vocabulary-set.service.js';
import { UnitVocabularySetController } from './unit-vocabulary-set.controller.js';
import { UnitVocabularySet } from './entities/unit_vocabulary_set.entity.js';
let UnitVocabularySetModule = class UnitVocabularySetModule {
};
UnitVocabularySetModule = __decorate([
    Module({
        imports: [SequelizeModule.forFeature([UnitVocabularySet])],
        controllers: [UnitVocabularySetController],
        providers: [UnitVocabularySetService],
        exports: [UnitVocabularySetService],
    })
], UnitVocabularySetModule);
export { UnitVocabularySetModule };
//# sourceMappingURL=unit-vocabulary-set.module.js.map