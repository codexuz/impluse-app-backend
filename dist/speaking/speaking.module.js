var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Speaking } from './entities/speaking.entity.js';
import { SpeakingService } from './speaking.service.js';
import { SpeakingController } from './speaking.controller.js';
import { RoleScenario } from '../role-scenarios/entities/role-scenario.entity.js';
import { PronunciationExercise } from '../pronunciation-exercise/entities/pronunciation-exercise.entity.js';
import { Ieltspart1Question } from '../ieltspart1-question/entities/ieltspart1-question.entity.js';
import { Ieltspart2Question } from '../ieltspart2-question/entities/ieltspart2-question.entity.js';
import { Ieltspart3Question } from '../ieltspart3-question/entities/ieltspart3-question.entity.js';
let SpeakingModule = class SpeakingModule {
};
SpeakingModule = __decorate([
    Module({
        imports: [
            SequelizeModule.forFeature([
                Speaking,
                RoleScenario,
                PronunciationExercise,
                Ieltspart1Question,
                Ieltspart2Question,
                Ieltspart3Question
            ])
        ],
        controllers: [SpeakingController],
        providers: [SpeakingService],
        exports: [SpeakingService],
    })
], SpeakingModule);
export { SpeakingModule };
//# sourceMappingURL=speaking.module.js.map