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
import { GroupsService } from './groups.service.js';
import { CreateGroupDto } from './dto/create-group.dto.js';
import { UpdateGroupDto } from './dto/update-group.dto.js';
import { Group } from './entities/group.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';
let GroupsController = class GroupsController {
    constructor(groupsService) {
        this.groupsService = groupsService;
    }
    async create(createGroupDto) {
        return await this.groupsService.create(createGroupDto);
    }
    async findAll() {
        return await this.groupsService.findAll();
    }
    async getActiveGroupsCount() {
        const count = await this.groupsService.countActiveGroups();
        return { count };
    }
    async findOne(id) {
        return await this.groupsService.findOne(id);
    }
    async findStudents(id) {
        return await this.groupsService.findAllStudentsInGroup(id);
    }
    async findTeacher(id) {
        return await this.groupsService.findTeacherOfGroup(id);
    }
    async findByTeacher(teacherId) {
        return await this.groupsService.findByTeacherId(teacherId);
    }
    async findByLevel(levelId) {
        return await this.groupsService.findByLevelId(levelId);
    }
    async update(id, updateGroupDto) {
        return await this.groupsService.update(id, updateGroupDto);
    }
    async remove(id) {
        return await this.groupsService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new group' }),
    ApiResponse({ status: 201, description: 'The group has been successfully created.', type: Group }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateGroupDto]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all groups' }),
    ApiResponse({ status: 200, description: 'Return all groups.', type: [Group] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "findAll", null);
__decorate([
    Get('group-count'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get count of all active groups' }),
    ApiResponse({ status: 200, description: 'Return the count of active groups.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "getActiveGroupsCount", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get a group by id' }),
    ApiResponse({ status: 200, description: 'Return the group.', type: Group }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Group not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "findOne", null);
__decorate([
    Get(':id/students'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all students in a group' }),
    ApiResponse({ status: 200, description: 'Return the group with its students.', type: Group }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Group not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "findStudents", null);
__decorate([
    Get(':id/teacher'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get the teacher of a group' }),
    ApiResponse({ status: 200, description: 'Return the group with its teacher.', type: Group }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Group not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "findTeacher", null);
__decorate([
    Get('teacher/:teacherId'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all groups for a teacher' }),
    ApiResponse({ status: 200, description: 'Return all groups for the teacher.', type: [Group] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "findByTeacher", null);
__decorate([
    Get('level/:levelId'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all groups for a level' }),
    ApiResponse({ status: 200, description: 'Return all groups for the level.', type: [Group] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('levelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "findByLevel", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update a group' }),
    ApiResponse({ status: 200, description: 'The group has been successfully updated.', type: Group }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Group not found.' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateGroupDto]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Delete a group' }),
    ApiResponse({ status: 200, description: 'The group has been successfully deleted.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Group not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "remove", null);
GroupsController = __decorate([
    ApiTags('Groups'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('groups'),
    __metadata("design:paramtypes", [GroupsService])
], GroupsController);
export { GroupsController };
//# sourceMappingURL=groups.controller.js.map