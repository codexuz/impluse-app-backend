var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PronunciationExerciseService } from './pronunciation-exercise.service.js';
import { PronunciationExerciseController } from './pronunciation-exercise.controller.js';
import { PronunciationExercise } from './entities/pronunciation-exercise.entity.js';
let PronunciationExerciseModule = class PronunciationExerciseModule {
};
PronunciationExerciseModule = __decorate([
    Module({
        imports: [
            SequelizeModule.forFeature([PronunciationExercise])
        ],
        controllers: [PronunciationExerciseController],
        providers: [PronunciationExerciseService],
        exports: [PronunciationExerciseService]
    })
], PronunciationExerciseModule);
export { PronunciationExerciseModule };
//# sourceMappingURL=pronunciation-exercise.module.js.map