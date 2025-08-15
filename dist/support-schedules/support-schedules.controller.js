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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SupportSchedulesService } from './support-schedules.service.js';
import { CreateSupportScheduleDto, UpdateSupportScheduleDto, SupportScheduleResponseDto } from './dto/index.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
let SupportSchedulesController = class SupportSchedulesController {
    constructor(supportSchedulesService) {
        this.supportSchedulesService = supportSchedulesService;
    }
    async create(createSupportScheduleDto) {
        return this.supportSchedulesService.create(createSupportScheduleDto);
    }
    async findAll() {
        return this.supportSchedulesService.findAll();
    }
    async findByTeacher(teacherId) {
        return this.supportSchedulesService.findByTeacher(teacherId);
    }
    async findByGroup(groupId) {
        return this.supportSchedulesService.findByGroup(groupId);
    }
    async findByDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.supportSchedulesService.findByDateRange(start, end);
    }
    async getStats() {
        return this.supportSchedulesService.getScheduleStats();
    }
    async findOne(id) {
        return this.supportSchedulesService.findOne(id);
    }
    async update(id, updateSupportScheduleDto) {
        return this.supportSchedulesService.update(id, updateSupportScheduleDto);
    }
    async remove(id) {
        return this.supportSchedulesService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER),
    ApiOperation({ summary: 'Create a new support schedule' }),
    ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Support schedule has been successfully created.',
        type: SupportScheduleResponseDto,
    }),
    ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input data.',
    }),
    ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.',
    }),
    ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Insufficient permissions.',
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSupportScheduleDto]),
    __metadata("design:returntype", Promise)
], SupportSchedulesController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER),
    ApiOperation({ summary: 'Get all support schedules' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'List of all support schedules.',
        type: [SupportScheduleResponseDto],
    }),
    ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.',
    }),
    ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Insufficient permissions.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupportSchedulesController.prototype, "findAll", null);
__decorate([
    Get('teacher/:teacherId'),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER),
    ApiOperation({ summary: 'Get support schedules by teacher ID' }),
    ApiParam({ name: 'teacherId', description: 'Teacher ID' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'List of support schedules for the specified teacher.',
        type: [SupportScheduleResponseDto],
    }),
    ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.',
    }),
    ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Insufficient permissions.',
    }),
    __param(0, Param('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupportSchedulesController.prototype, "findByTeacher", null);
__decorate([
    Get('group/:groupId'),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER),
    ApiOperation({ summary: 'Get support schedules by group ID' }),
    ApiParam({ name: 'groupId', description: 'Group ID' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'List of support schedules for the specified group.',
        type: [SupportScheduleResponseDto],
    }),
    ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.',
    }),
    ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Insufficient permissions.',
    }),
    __param(0, Param('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupportSchedulesController.prototype, "findByGroup", null);
__decorate([
    Get('date-range'),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER),
    ApiOperation({ summary: 'Get support schedules within a date range' }),
    ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)' }),
    ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'List of support schedules within the specified date range.',
        type: [SupportScheduleResponseDto],
    }),
    ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid date format.',
    }),
    ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.',
    }),
    ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Insufficient permissions.',
    }),
    __param(0, Query('startDate')),
    __param(1, Query('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SupportSchedulesController.prototype, "findByDateRange", null);
__decorate([
    Get('stats'),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER),
    ApiOperation({ summary: 'Get support schedule statistics' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'Support schedule statistics.',
        schema: {
            type: 'object',
            properties: {
                totalSchedules: { type: 'number' },
                upcomingSchedules: { type: 'number' },
                pastSchedules: { type: 'number' },
            },
        },
    }),
    ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.',
    }),
    ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Insufficient permissions.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupportSchedulesController.prototype, "getStats", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER),
    ApiOperation({ summary: 'Get a support schedule by ID' }),
    ApiParam({ name: 'id', description: 'Support schedule ID' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'Support schedule details.',
        type: SupportScheduleResponseDto,
    }),
    ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Support schedule not found.',
    }),
    ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.',
    }),
    ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Insufficient permissions.',
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupportSchedulesController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER),
    ApiOperation({ summary: 'Update a support schedule' }),
    ApiParam({ name: 'id', description: 'Support schedule ID' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'Support schedule has been successfully updated.',
        type: SupportScheduleResponseDto,
    }),
    ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Support schedule not found.',
    }),
    ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input data.',
    }),
    ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.',
    }),
    ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Insufficient permissions.',
    }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateSupportScheduleDto]),
    __metadata("design:returntype", Promise)
], SupportSchedulesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER),
    ApiOperation({ summary: 'Delete a support schedule' }),
    ApiParam({ name: 'id', description: 'Support schedule ID' }),
    ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Support schedule has been successfully deleted.',
    }),
    ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Support schedule not found.',
    }),
    ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.',
    }),
    ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Insufficient permissions.',
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupportSchedulesController.prototype, "remove", null);
SupportSchedulesController = __decorate([
    ApiTags('Support Schedules'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('support-schedules'),
    __metadata("design:paramtypes", [SupportSchedulesService])
], SupportSchedulesController);
export { SupportSchedulesController };
//# sourceMappingURL=support-schedules.controller.js.map