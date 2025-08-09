var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { GroupStudentsService } from './group-students.service.js';
import { GroupStudentsController } from './group-students.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from '../groups/entities/group.entity.js';
import { GroupStudent } from './entities/group-student.entity.js';
let GroupStudentsModule = class GroupStudentsModule {
};
GroupStudentsModule = __decorate([
    Module({
        imports: [SequelizeModule.forFeature([Group, GroupStudent])],
        controllers: [GroupStudentsController],
        providers: [GroupStudentsService],
        exports: [GroupStudentsService],
    })
], GroupStudentsModule);
export { GroupStudentsModule };
//# sourceMappingURL=group-students.module.js.map