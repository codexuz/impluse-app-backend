var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleScenariosService } from './role-scenarios.service.js';
import { RoleScenariosController } from './role-scenarios.controller.js';
import { RoleScenario } from './entities/role-scenario.entity.js';
let RoleScenariosModule = class RoleScenariosModule {
};
RoleScenariosModule = __decorate([
    Module({
        imports: [SequelizeModule.forFeature([RoleScenario])],
        controllers: [RoleScenariosController],
        providers: [RoleScenariosService],
        exports: [RoleScenariosService]
    })
], RoleScenariosModule);
export { RoleScenariosModule };
//# sourceMappingURL=role-scenarios.module.js.map