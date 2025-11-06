var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExerciseService } from './exercise.service.js';
import { ExerciseController } from './exercise.controller.js';
import { Exercise } from './entities/exercise.entity.js';
import { Choices } from './entities/choices.js';
import { GapFilling } from './entities/gap_filling.js';
import { MatchingExercise } from './entities/matching_pairs.js';
import { TypingExercise } from './entities/typing_answers.js';
import { Questions } from './entities/questions.js';
import { SentenceBuild } from './entities/sentence_build.js';
let ExerciseModule = class ExerciseModule {
};
ExerciseModule = __decorate([
    Module({
        imports: [
            SequelizeModule.forFeature([
                Exercise,
                Questions,
                SentenceBuild,
                Choices,
                GapFilling,
                MatchingExercise,
                TypingExercise
            ])
        ],
        controllers: [ExerciseController],
        providers: [ExerciseService],
        exports: [ExerciseService]
    })
], ExerciseModule);
export { ExerciseModule };
//# sourceMappingURL=exercise.module.js.map