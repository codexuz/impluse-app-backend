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
import { GroupStudentsService } from './group-students.service.js';
import { CreateGroupStudentDto } from './dto/create-group-student.dto.js';
import { UpdateGroupStudentDto } from './dto/update-group-student.dto.js';
import { GroupStudent } from './entities/group-student.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';
let GroupStudentsController = class GroupStudentsController {
    constructor(groupStudentsService) {
        this.groupStudentsService = groupStudentsService;
    }
    async create(createGroupStudentDto) {
        return await this.groupStudentsService.create(createGroupStudentDto);
    }
    async findAll() {
        return await this.groupStudentsService.findAll();
    }
    async findByGroupId(groupId) {
        return await this.groupStudentsService.findByGroupId(groupId);
    }
    async findActiveByGroupId(groupId) {
        return await this.groupStudentsService.findActiveByGroupId(groupId);
    }
    async findByStudentId(studentId) {
        return await this.groupStudentsService.findByStudentId(studentId);
    }
    async countStudentsByTeacher(teacherId) {
        const count = await this.groupStudentsService.countStudentsByTeacher(teacherId);
        return { count };
    }
    async getStudentsByTeacher(teacherId) {
        return await this.groupStudentsService.getStudentsByTeacher(teacherId);
    }
    async findOne(id) {
        return await this.groupStudentsService.findOne(id);
    }
    async update(id, updateGroupStudentDto) {
        return await this.groupStudentsService.update(id, updateGroupStudentDto);
    }
    async updateStatus(id, status) {
        return await this.groupStudentsService.updateStatus(id, status);
    }
    async remove(id) {
        return await this.groupStudentsService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Add a student to a group' }),
    ApiResponse({ status: 201, description: 'The student has been successfully added to the group.', type: GroupStudent }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateGroupStudentDto]),
    __metadata("design:returntype", Promise)
], GroupStudentsController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all group student entries' }),
    ApiResponse({ status: 200, description: 'Return all group student entries.', type: [GroupStudent] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GroupStudentsController.prototype, "findAll", null);
__decorate([
    Get('group/:groupId'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all students in a specific group' }),
    ApiResponse({ status: 200, description: 'Return all students in the group.', type: [GroupStudent] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupStudentsController.prototype, "findByGroupId", null);
__decorate([
    Get('group/:groupId/active'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all active students in a specific group' }),
    ApiResponse({ status: 200, description: 'Return all active students in the group.', type: [GroupStudent] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupStudentsController.prototype, "findActiveByGroupId", null);
__decorate([
    Get('student/:studentId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all groups for a specific student' }),
    ApiResponse({ status: 200, description: 'Return all groups the student is in.', type: [GroupStudent] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupStudentsController.prototype, "findByStudentId", null);
__decorate([
    Get('teacher/:teacherId/count'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get the count of all active students for a specific teacher' }),
    ApiResponse({ status: 200, description: 'Return the count of active students for the teacher.', schema: { type: 'object', properties: { count: { type: 'number' } } } }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupStudentsController.prototype, "countStudentsByTeacher", null);
__decorate([
    Get('teacher/:teacherId/students'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all active students for a specific teacher across all their groups' }),
    ApiResponse({ status: 200, description: 'Return all active students for the teacher with group and student details.', type: [GroupStudent] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupStudentsController.prototype, "getStudentsByTeacher", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get a group student entry by id' }),
    ApiResponse({ status: 200, description: 'Return the group student entry.', type: GroupStudent }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Group student entry not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupStudentsController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update a group student entry' }),
    ApiResponse({ status: 200, description: 'The group student entry has been successfully updated.', type: GroupStudent }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Group student entry not found.' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateGroupStudentDto]),
    __metadata("design:returntype", Promise)
], GroupStudentsController.prototype, "update", null);
__decorate([
    Patch(':id/status'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update a student\'s status in the group' }),
    ApiResponse({ status: 200, description: 'The student\'s status has been successfully updated.', type: GroupStudent }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Group student entry not found.' }),
    __param(0, Param('id')),
    __param(1, Body('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GroupStudentsController.prototype, "updateStatus", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete a group student entry' }),
    ApiResponse({ status: 200, description: 'The group student entry has been successfully deleted.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Group student entry not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupStudentsController.prototype, "remove", null);
GroupStudentsController = __decorate([
    ApiTags('Group Students'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('group-students'),
    __metadata("design:paramtypes", [GroupStudentsService])
], GroupStudentsController);
export { GroupStudentsController };
//# sourceMappingURL=group-students.controller.js.map