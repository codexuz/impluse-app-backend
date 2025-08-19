var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoleScenario } from './entities/role-scenario.entity.js';
let RoleScenariosService = class RoleScenariosService {
    constructor(roleScenarioModel) {
        this.roleScenarioModel = roleScenarioModel;
    }
    async create(createRoleScenarioDto) {
        return this.roleScenarioModel.create({ ...createRoleScenarioDto });
    }
    async findAll() {
        return this.roleScenarioModel.findAll();
    }
    async findOne(id) {
        const roleScenario = await this.roleScenarioModel.findByPk(id);
        if (!roleScenario) {
            throw new NotFoundException('Role scenario not found');
        }
        return roleScenario;
    }
    async findBySpeakingId(speakingId) {
        return this.roleScenarioModel.findAll({
            where: { speaking_id: speakingId }
        });
    }
    async update(id, updateRoleScenarioDto) {
        const roleScenario = await this.findOne(id);
        await roleScenario.update(updateRoleScenarioDto);
        return roleScenario;
    }
    async remove(id) {
        const roleScenario = await this.findOne(id);
        await roleScenario.destroy();
    }
};
RoleScenariosService = __decorate([
    Injectable(),
    __param(0, InjectModel(RoleScenario)),
    __metadata("design:paramtypes", [Object])
], RoleScenariosService);
export { RoleScenariosService };
//# sourceMappingURL=role-scenarios.service.js.map