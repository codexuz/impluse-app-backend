var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { Ieltspart2QuestionService } from './ieltspart2-question.service.js';
import { Ieltspart2QuestionController } from './ieltspart2-question.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ieltspart2Question } from './entities/ieltspart2-question.entity.js';
let Ieltspart2QuestionModule = class Ieltspart2QuestionModule {
};
Ieltspart2QuestionModule = __decorate([
    Module({
        imports: [SequelizeModule.forFeature([Ieltspart2Question])],
        controllers: [Ieltspart2QuestionController],
        providers: [Ieltspart2QuestionService],
        exports: [Ieltspart2QuestionService],
    })
], Ieltspart2QuestionModule);
export { Ieltspart2QuestionModule };
//# sourceMappingURL=ieltspart2-question.module.js.map