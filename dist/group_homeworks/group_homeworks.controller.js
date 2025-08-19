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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GroupHomeworksService } from './group_homeworks.service.js';
import { CreateGroupHomeworkDto } from './dto/create-group-homework.dto.js';
import { UpdateGroupHomeworkDto } from './dto/update-group_homework.dto.js';
import { GroupHomework } from './entities/group_homework.entity.js';
import { StudentHomeworkStatusDto, GroupHomeworkStatusDto, OverallHomeworkStatsDto } from './dto/homework-status-response.dto.js';
import { HomeworkWithExerciseStatusDto } from './dto/homework-with-exercise-status.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';
let GroupHomeworksController = class GroupHomeworksController {
    constructor(groupHomeworksService) {
        this.groupHomeworksService = groupHomeworksService;
    }
    async create(createGroupHomeworkDto) {
        return await this.groupHomeworksService.create(createGroupHomeworkDto);
    }
    async findAll() {
        return await this.groupHomeworksService.findAll();
    }
    async findByGroupId(groupId) {
        return await this.groupHomeworksService.findByGroupId(groupId);
    }
    async findByTeacherId(teacherId) {
        return await this.groupHomeworksService.findByTeacherId(teacherId);
    }
    async findByLessonId(lessonId) {
        return await this.groupHomeworksService.findByLessonId(lessonId);
    }
    async findOne(id) {
        return await this.groupHomeworksService.findOne(id);
    }
    async update(id, updateGroupHomeworkDto) {
        return await this.groupHomeworksService.update(id, updateGroupHomeworkDto);
    }
    async remove(id) {
        return await this.groupHomeworksService.remove(id);
    }
    async getHomeworksForUser(userId) {
        return await this.groupHomeworksService.getHomeworksForUser(userId);
    }
    async getActiveHomeworksByDate(userId) {
        return await this.groupHomeworksService.getActiveHomeworksByDate(userId);
    }
    async getActiveHomeworksBySpecificDate(userId, dateString) {
        const date = new Date(dateString);
        return await this.groupHomeworksService.getActiveHomeworksByDate(userId, date);
    }
    async getHomeworkWithLessonContent(homeworkId) {
        return await this.groupHomeworksService.getHomeworkWithLessonContent(homeworkId);
    }
    async getHomeworkStatusByStudent(studentId, groupId) {
        return await this.groupHomeworksService.getHomeworkStatusByStudent(studentId, groupId);
    }
    async getHomeworkStatusByGroup(groupId) {
        return await this.groupHomeworksService.getHomeworkStatusByGroup(groupId);
    }
    async getOverallHomeworkStats(groupId) {
        return await this.groupHomeworksService.getOverallHomeworkStats(groupId);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new homework assignment for a group' }),
    ApiResponse({ status: 201, description: 'The homework has been successfully created.', type: GroupHomework }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateGroupHomeworkDto]),
    __metadata("design:returntype", Promise)
], GroupHomeworksController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all homework assignments' }),
    ApiResponse({ status: 200, description: 'Return all homework assignments.', type: [GroupHomework] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GroupHomeworksController.prototype, "findAll", null);
__decorate([
    Get('group/:groupId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.STUDENT),
    ApiOperation({ summary: 'Get all homework assignments for a specific group' }),
    ApiResponse({ status: 200, description: 'Return all homeworks assigned to the group.', type: [GroupHomework] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupHomeworksController.prototype, "findByGroupId", null);
__decorate([
    Get('teacher/:teacherId'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all homework assignments by a specific teacher' }),
    ApiResponse({ status: 200, description: 'Return all homeworks assigned by the teacher.', type: [GroupHomework] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupHomeworksController.prototype, "findByTeacherId", null);
__decorate([
    Get('lesson/:lessonId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all homework assignments for a specific lesson' }),
    ApiResponse({ status: 200, description: 'Return all homeworks for the lesson.', type: [GroupHomework] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupHomeworksController.prototype, "findByLessonId", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get a homework assignment by id' }),
    ApiResponse({ status: 200, description: 'Return the homework assignment.', type: GroupHomework }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Homework not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupHomeworksController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update a homework assignment' }),
    ApiResponse({ status: 200, description: 'The homework has been successfully updated.', type: GroupHomework }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Homework not found.' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateGroupHomeworkDto]),
    __metadata("design:returntype", Promise)
], GroupHomeworksController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete a homework assignment' }),
    ApiResponse({ status: 200, description: 'The homework has been successfully deleted.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Homework not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupHomeworksController.prototype, "remove", null);
__decorate([
    Get('user/:userId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all homework assignments for a specific user with exercise completion status' }),
    ApiResponse({ status: 200, description: 'Return all homeworks for the user\'s group with exercise status.', type: [HomeworkWithExerciseStatusDto] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'User is not in any group.' }),
    __param(0, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupHomeworksController.prototype, "getHomeworksForUser", null);
__decorate([
    Get('active/:userId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get active homework assignments for a specific user with exercise completion status' }),
    ApiResponse({ status: 200, description: 'Return active homeworks for the user\'s group with exercise status.', type: [HomeworkWithExerciseStatusDto] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'User is not in any group.' }),
    __param(0, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupHomeworksController.prototype, "getActiveHomeworksByDate", null);
__decorate([
    Get('active/:userId/:date'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get active homework assignments for a specific user for a specific date with exercise completion status' }),
    ApiResponse({ status: 200, description: 'Return active homeworks for the user\'s group on a specific date with exercise status.', type: [HomeworkWithExerciseStatusDto] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'User is not in any group.' }),
    __param(0, Param('userId')),
    __param(1, Param('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GroupHomeworksController.prototype, "getActiveHomeworksBySpecificDate", null);
__decorate([
    Get('content/:homeworkId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get homework with detailed lesson content including exercises and speaking activities' }),
    ApiResponse({ status: 200, description: 'Return homework with lesson, exercises, and speaking content.', type: GroupHomework }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Homework not found.' }),
    __param(0, Param('homeworkId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupHomeworksController.prototype, "getHomeworkWithLessonContent", null);
__decorate([
    Get('status/student/:studentId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get finished and unfinished homeworks for a specific student' }),
    ApiParam({ name: 'studentId', description: 'Student ID' }),
    ApiQuery({ name: 'groupId', description: 'Optional group ID filter', required: false }),
    ApiResponse({ status: 200, description: 'Return categorized homeworks (finished/unfinished) for the student.', type: StudentHomeworkStatusDto }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('studentId')),
    __param(1, Query('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GroupHomeworksController.prototype, "getHomeworkStatusByStudent", null);
__decorate([
    Get('status/group/:groupId'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get homework completion status for all students in a group' }),
    ApiParam({ name: 'groupId', description: 'Group ID' }),
    ApiResponse({ status: 200, description: 'Return homework completion status for all students in the group.', type: GroupHomeworkStatusDto }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupHomeworksController.prototype, "getHomeworkStatusByGroup", null);
__decorate([
    Get('stats/overview'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get overall homework statistics' }),
    ApiQuery({ name: 'groupId', description: 'Optional group ID filter', required: false }),
    ApiResponse({ status: 200, description: 'Return overall homework statistics.', type: OverallHomeworkStatsDto }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Query('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupHomeworksController.prototype, "getOverallHomeworkStats", null);
GroupHomeworksController = __decorate([
    ApiTags('Group Homeworks'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('group-homeworks'),
    __metadata("design:paramtypes", [GroupHomeworksService])
], GroupHomeworksController);
export { GroupHomeworksController };
//# sourceMappingURL=group_homeworks.controller.js.map