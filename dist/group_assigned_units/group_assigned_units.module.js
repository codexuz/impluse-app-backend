var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupAssignedUnitsService } from './group_assigned_units.service.js';
import { GroupAssignedUnitsController } from './group_assigned_units.controller.js';
import { GroupAssignedUnit } from './entities/group_assigned_unit.entity.js';
import { LessonModule } from '../lesson/lesson.module.js';
import { GroupAssignedLessonsModule } from '../group_assigned_lessons/group_assigned_lessons.module.js';
let GroupAssignedUnitsModule = class GroupAssignedUnitsModule {
};
GroupAssignedUnitsModule = __decorate([
    Module({
        imports: [
            SequelizeModule.forFeature([GroupAssignedUnit]),
            LessonModule,
            GroupAssignedLessonsModule
        ],
        controllers: [GroupAssignedUnitsController],
        providers: [GroupAssignedUnitsService],
        exports: [GroupAssignedUnitsService]
    })
], GroupAssignedUnitsModule);
export { GroupAssignedUnitsModule };
//# sourceMappingURL=group_assigned_units.module.js.map