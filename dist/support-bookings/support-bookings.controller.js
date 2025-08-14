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
import { SupportBookingsService } from './support-bookings.service.js';
import { CreateSupportBookingDto, UpdateSupportBookingDto, SupportBookingResponseDto, BookingStatus } from './dto/index.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
let SupportBookingsController = class SupportBookingsController {
    constructor(supportBookingsService) {
        this.supportBookingsService = supportBookingsService;
    }
    async create(createSupportBookingDto) {
        return this.supportBookingsService.create(createSupportBookingDto);
    }
    async findAll() {
        return this.supportBookingsService.findAll();
    }
    async findByStudent(studentId) {
        return this.supportBookingsService.findByStudent(studentId);
    }
    async findByTeacher(teacherId) {
        return this.supportBookingsService.findByTeacher(teacherId);
    }
    async findByStatus(status) {
        return this.supportBookingsService.findByStatus(status);
    }
    async findBySchedule(scheduleId) {
        return this.supportBookingsService.findBySchedule(scheduleId);
    }
    async findByDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.supportBookingsService.findByDateRange(start, end);
    }
    async getStats() {
        return this.supportBookingsService.getBookingStats();
    }
    async findOne(id) {
        return this.supportBookingsService.findOne(id);
    }
    async update(id, updateSupportBookingDto) {
        return this.supportBookingsService.update(id, updateSupportBookingDto);
    }
    async updateStatus(id, status) {
        return this.supportBookingsService.updateStatus(id, status);
    }
    async remove(id) {
        return this.supportBookingsService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Create a new support booking' }),
    ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Support booking has been successfully created.',
        type: SupportBookingResponseDto,
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
    __metadata("design:paramtypes", [CreateSupportBookingDto]),
    __metadata("design:returntype", Promise)
], SupportBookingsController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER),
    ApiOperation({ summary: 'Get all support bookings' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'List of all support bookings.',
        type: [SupportBookingResponseDto],
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
], SupportBookingsController.prototype, "findAll", null);
__decorate([
    Get('student/:studentId'),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get support bookings by student ID' }),
    ApiParam({ name: 'studentId', description: 'Student ID' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'List of support bookings for the specified student.',
        type: [SupportBookingResponseDto],
    }),
    ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.',
    }),
    ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Insufficient permissions.',
    }),
    __param(0, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupportBookingsController.prototype, "findByStudent", null);
__decorate([
    Get('teacher/:teacherId'),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER),
    ApiOperation({ summary: 'Get support bookings by teacher ID' }),
    ApiParam({ name: 'teacherId', description: 'Teacher ID' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'List of support bookings for the specified teacher.',
        type: [SupportBookingResponseDto],
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
], SupportBookingsController.prototype, "findByTeacher", null);
__decorate([
    Get('status/:status'),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER),
    ApiOperation({ summary: 'Get support bookings by status' }),
    ApiParam({ name: 'status', enum: BookingStatus, description: 'Booking status' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'List of support bookings with the specified status.',
        type: [SupportBookingResponseDto],
    }),
    ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.',
    }),
    ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Insufficient permissions.',
    }),
    __param(0, Param('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupportBookingsController.prototype, "findByStatus", null);
__decorate([
    Get('schedule/:scheduleId'),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER),
    ApiOperation({ summary: 'Get support bookings by schedule ID' }),
    ApiParam({ name: 'scheduleId', description: 'Schedule ID' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'List of support bookings for the specified schedule.',
        type: [SupportBookingResponseDto],
    }),
    ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.',
    }),
    ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Insufficient permissions.',
    }),
    __param(0, Param('scheduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupportBookingsController.prototype, "findBySchedule", null);
__decorate([
    Get('date-range'),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER),
    ApiOperation({ summary: 'Get support bookings within a date range' }),
    ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)' }),
    ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'List of support bookings within the specified date range.',
        type: [SupportBookingResponseDto],
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
], SupportBookingsController.prototype, "findByDateRange", null);
__decorate([
    Get('stats'),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER),
    ApiOperation({ summary: 'Get support booking statistics' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'Support booking statistics.',
        schema: {
            type: 'object',
            properties: {
                totalBookings: { type: 'number' },
                pendingBookings: { type: 'number' },
                approvedBookings: { type: 'number' },
                cancelledBookings: { type: 'number' },
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
], SupportBookingsController.prototype, "getStats", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get a support booking by ID' }),
    ApiParam({ name: 'id', description: 'Support booking ID' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'Support booking details.',
        type: SupportBookingResponseDto,
    }),
    ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Support booking not found.',
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
], SupportBookingsController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Update a support booking' }),
    ApiParam({ name: 'id', description: 'Support booking ID' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'Support booking has been successfully updated.',
        type: SupportBookingResponseDto,
    }),
    ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Support booking not found.',
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
    __metadata("design:paramtypes", [String, UpdateSupportBookingDto]),
    __metadata("design:returntype", Promise)
], SupportBookingsController.prototype, "update", null);
__decorate([
    Patch(':id/status'),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER),
    ApiOperation({ summary: 'Update support booking status' }),
    ApiParam({ name: 'id', description: 'Support booking ID' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'Booking status has been successfully updated.',
        type: SupportBookingResponseDto,
    }),
    ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Support booking not found.',
    }),
    ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid status.',
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
    __param(1, Body('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SupportBookingsController.prototype, "updateStatus", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN, Role.SUPPORT_TEACHER),
    ApiOperation({ summary: 'Delete a support booking' }),
    ApiParam({ name: 'id', description: 'Support booking ID' }),
    ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Support booking has been successfully deleted.',
    }),
    ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Support booking not found.',
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
], SupportBookingsController.prototype, "remove", null);
SupportBookingsController = __decorate([
    ApiTags('Support Bookings'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('support-bookings'),
    __metadata("design:paramtypes", [SupportBookingsService])
], SupportBookingsController);
export { SupportBookingsController };
//# sourceMappingURL=support-bookings.controller.js.map