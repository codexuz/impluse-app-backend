var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service.js';
import { GroupsController } from './groups.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from './entities/group.entity.js';
let GroupsModule = class GroupsModule {
};
GroupsModule = __decorate([
    Module({
        imports: [SequelizeModule.forFeature([Group])],
        controllers: [GroupsController],
        providers: [GroupsService],
        exports: [GroupsService],
    })
], GroupsModule);
export { GroupsModule };
//# sourceMappingURL=groups.module.js.map