var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadTrialLessonsService } from './lead-trial-lessons.service.js';
import { LeadTrialLessonsController } from './lead-trial-lessons.controller.js';
import { LeadTrialLesson } from './entities/lead-trial-lesson.entity.js';
let LeadTrialLessonsModule = class LeadTrialLessonsModule {
};
LeadTrialLessonsModule = __decorate([
    Module({
        imports: [SequelizeModule.forFeature([LeadTrialLesson])],
        controllers: [LeadTrialLessonsController],
        providers: [LeadTrialLessonsService],
        exports: [LeadTrialLessonsService, SequelizeModule]
    })
], LeadTrialLessonsModule);
export { LeadTrialLessonsModule };
//# sourceMappingURL=lead-trial-lessons.module.js.map