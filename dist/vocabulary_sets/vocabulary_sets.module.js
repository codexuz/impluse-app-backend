var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VocabularySetsService } from './vocabulary_sets.service.js';
import { VocabularySetsController } from './vocabulary_sets.controller.js';
import { VocabularySet } from './entities/vocabulary_set.entity.js';
let VocabularySetsModule = class VocabularySetsModule {
};
VocabularySetsModule = __decorate([
    Module({
        imports: [
            SequelizeModule.forFeature([VocabularySet])
        ],
        controllers: [VocabularySetsController],
        providers: [VocabularySetsService],
        exports: [VocabularySetsService, SequelizeModule]
    })
], VocabularySetsModule);
export { VocabularySetsModule };
//# sourceMappingURL=vocabulary_sets.module.js.map