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
import { GroupAssignedLessonsService } from './group_assigned_lessons.service.js';
import { CreateGroupAssignedLessonDto } from './dto/create-group_assigned_lesson.dto.js';
import { UpdateGroupAssignedLessonDto } from './dto/update-group_assigned_lesson.dto.js';
import { GroupAssignedLesson } from './entities/group_assigned_lesson.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';
let GroupAssignedLessonsController = class GroupAssignedLessonsController {
    constructor(groupAssignedLessonsService) {
        this.groupAssignedLessonsService = groupAssignedLessonsService;
    }
    async create(createGroupAssignedLessonDto) {
        return await this.groupAssignedLessonsService.create(createGroupAssignedLessonDto);
    }
    async findAll() {
        return await this.groupAssignedLessonsService.findAll();
    }
    async findByGroupId(groupId) {
        return await this.groupAssignedLessonsService.findByGroupId(groupId);
    }
    async findByUnitId(unitId) {
        return await this.groupAssignedLessonsService.findByUnitId(unitId);
    }
    async findOne(id) {
        return await this.groupAssignedLessonsService.findOne(id);
    }
    async update(id, updateGroupAssignedLessonDto) {
        return await this.groupAssignedLessonsService.update(id, updateGroupAssignedLessonDto);
    }
    async remove(id) {
        return await this.groupAssignedLessonsService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new lesson assignment for a group' }),
    ApiResponse({ status: 201, description: 'The lesson has been successfully assigned to the group.', type: GroupAssignedLesson }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateGroupAssignedLessonDto]),
    __metadata("design:returntype", Promise)
], GroupAssignedLessonsController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all assigned lessons' }),
    ApiResponse({ status: 200, description: 'Return all assigned lessons.', type: [GroupAssignedLesson] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GroupAssignedLessonsController.prototype, "findAll", null);
__decorate([
    Get('group/:groupId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all assigned lessons for a specific group' }),
    ApiResponse({ status: 200, description: 'Return all lessons assigned to the group.', type: [GroupAssignedLesson] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupAssignedLessonsController.prototype, "findByGroupId", null);
__decorate([
    Get('unit/:unitId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all assigned lessons for a specific unit' }),
    ApiResponse({ status: 200, description: 'Return all lessons assigned to the unit.', type: [GroupAssignedLesson] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('unitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupAssignedLessonsController.prototype, "findByUnitId", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get an assigned lesson by id' }),
    ApiResponse({ status: 200, description: 'Return the assigned lesson.', type: GroupAssignedLesson }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Assigned lesson not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupAssignedLessonsController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update an assigned lesson' }),
    ApiResponse({ status: 200, description: 'The assigned lesson has been successfully updated.', type: GroupAssignedLesson }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Assigned lesson not found.' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateGroupAssignedLessonDto]),
    __metadata("design:returntype", Promise)
], GroupAssignedLessonsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Delete an assigned lesson' }),
    ApiResponse({ status: 200, description: 'The assigned lesson has been successfully deleted.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Assigned lesson not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupAssignedLessonsController.prototype, "remove", null);
GroupAssignedLessonsController = __decorate([
    ApiTags('Group Assigned Lessons'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('group-assigned-lessons'),
    __metadata("design:paramtypes", [GroupAssignedLessonsService])
], GroupAssignedLessonsController);
export { GroupAssignedLessonsController };
//# sourceMappingURL=group_assigned_lessons.controller.js.map