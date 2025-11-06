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
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GroupAssignedUnitsService } from './group_assigned_units.service.js';
import { CreateGroupAssignedUnitDto } from './dto/create-group_assigned_unit.dto.js';
import { UpdateGroupAssignedUnitDto } from './dto/update-group_assigned_unit.dto.js';
import { GroupAssignedUnit } from './entities/group_assigned_unit.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';
let GroupAssignedUnitsController = class GroupAssignedUnitsController {
    constructor(groupAssignedUnitsService) {
        this.groupAssignedUnitsService = groupAssignedUnitsService;
    }
    async create(createGroupAssignedUnitDto) {
        return await this.groupAssignedUnitsService.create(createGroupAssignedUnitDto);
    }
    async findAll() {
        return await this.groupAssignedUnitsService.findAll();
    }
    async findByGroupId(groupId) {
        return await this.groupAssignedUnitsService.findByGroupId(groupId);
    }
    async findOne(id) {
        return await this.groupAssignedUnitsService.findOne(id);
    }
    async update(id, updateGroupAssignedUnitDto) {
        return await this.groupAssignedUnitsService.update(id, updateGroupAssignedUnitDto);
    }
    async remove(id) {
        return await this.groupAssignedUnitsService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new unit assignment for a group' }),
    ApiResponse({ status: 201, description: 'The unit has been successfully assigned to the group.', type: GroupAssignedUnit }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateGroupAssignedUnitDto]),
    __metadata("design:returntype", Promise)
], GroupAssignedUnitsController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all assigned units' }),
    ApiResponse({ status: 200, description: 'Return all assigned units.', type: [GroupAssignedUnit] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GroupAssignedUnitsController.prototype, "findAll", null);
__decorate([
    Get('group/:groupId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all assigned units for a specific group' }),
    ApiResponse({ status: 200, description: 'Return all units assigned to the group.', type: [GroupAssignedUnit] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupAssignedUnitsController.prototype, "findByGroupId", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get an assigned unit by id' }),
    ApiResponse({ status: 200, description: 'Return the assigned unit.', type: GroupAssignedUnit }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Assigned unit not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupAssignedUnitsController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update an assigned unit' }),
    ApiResponse({ status: 200, description: 'The assigned unit has been successfully updated.', type: GroupAssignedUnit }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Assigned unit not found.' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateGroupAssignedUnitDto]),
    __metadata("design:returntype", Promise)
], GroupAssignedUnitsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Delete an assigned unit' }),
    ApiResponse({ status: 200, description: 'The assigned unit has been successfully deleted.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Assigned unit not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupAssignedUnitsController.prototype, "remove", null);
GroupAssignedUnitsController = __decorate([
    ApiTags('Group Assigned Units'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('group-assigned-units'),
    __metadata("design:paramtypes", [GroupAssignedUnitsService])
], GroupAssignedUnitsController);
export { GroupAssignedUnitsController };
//# sourceMappingURL=group_assigned_units.controller.js.map