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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { RoleScenariosService } from './role-scenarios.service.js';
import { CreateRoleScenarioDto } from './dto/create-role-scenario.dto.js';
import { UpdateRoleScenarioDto } from './dto/update-role-scenario.dto.js';
import { RoleScenario } from './entities/role-scenario.entity.js';
let RoleScenariosController = class RoleScenariosController {
    constructor(roleScenariosService) {
        this.roleScenariosService = roleScenariosService;
    }
    create(createRoleScenarioDto) {
        return this.roleScenariosService.create(createRoleScenarioDto);
    }
    findAll() {
        return this.roleScenariosService.findAll();
    }
    findOne(id) {
        return this.roleScenariosService.findOne(id);
    }
    findBySpeakingId(speakingId) {
        return this.roleScenariosService.findBySpeakingId(speakingId);
    }
    update(id, updateRoleScenarioDto) {
        return this.roleScenariosService.update(id, updateRoleScenarioDto);
    }
    remove(id) {
        return this.roleScenariosService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new role scenario' }),
    ApiResponse({ status: 201, type: RoleScenario }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRoleScenarioDto]),
    __metadata("design:returntype", void 0)
], RoleScenariosController.prototype, "create", null);
__decorate([
    Get(),
    ApiOperation({ summary: 'Get all role scenarios' }),
    ApiResponse({ status: 200, type: [RoleScenario] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoleScenariosController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Get a role scenario by id' }),
    ApiResponse({ status: 200, type: RoleScenario }),
    ApiResponse({ status: 404, description: 'Not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoleScenariosController.prototype, "findOne", null);
__decorate([
    Get('speaking/:speakingId'),
    ApiOperation({ summary: 'Get role scenarios by speaking exercise id' }),
    ApiResponse({ status: 200, type: [RoleScenario] }),
    __param(0, Param('speakingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoleScenariosController.prototype, "findBySpeakingId", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update a role scenario' }),
    ApiResponse({ status: 200, type: RoleScenario }),
    ApiResponse({ status: 404, description: 'Not found' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateRoleScenarioDto]),
    __metadata("design:returntype", void 0)
], RoleScenariosController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete a role scenario' }),
    ApiResponse({ status: 200 }),
    ApiResponse({ status: 404, description: 'Not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoleScenariosController.prototype, "remove", null);
RoleScenariosController = __decorate([
    ApiTags('role-scenarios'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('role-scenarios'),
    __metadata("design:paramtypes", [RoleScenariosService])
], RoleScenariosController);
export { RoleScenariosController };
//# sourceMappingURL=role-scenarios.controller.js.map