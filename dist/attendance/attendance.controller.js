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
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service.js';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { UpdateAttendanceDto } from './dto/update-attendance.dto.js';
import { AttendanceResponseDto, AttendanceStatsDto } from './dto/attendance-response.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
let AttendanceController = class AttendanceController {
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async create(createAttendanceDto) {
        return await this.attendanceService.create(createAttendanceDto);
    }
    async findAll() {
        return await this.attendanceService.findAll();
    }
    async findByGroup(groupId) {
        return await this.attendanceService.findByGroupId(groupId);
    }
    async findByStudent(studentId) {
        return await this.attendanceService.findByStudentId(studentId);
    }
    async findByTeacher(teacherId) {
        return await this.attendanceService.findByTeacherId(teacherId);
    }
    async findByStatus(status) {
        return await this.attendanceService.findByStatus(status);
    }
    async findByDateRange(startDate, endDate) {
        return await this.attendanceService.findByDateRange(startDate, endDate);
    }
    async findByGroupAndDateRange(groupId, startDate, endDate) {
        return await this.attendanceService.findByGroupAndDateRange(groupId, startDate, endDate);
    }
    async findByStudentAndDateRange(studentId, startDate, endDate) {
        return await this.attendanceService.findByStudentAndDateRange(studentId, startDate, endDate);
    }
    async getAttendanceStats(groupId, studentId, startDate, endDate) {
        return await this.attendanceService.getAttendanceStats(groupId, studentId, startDate, endDate);
    }
    async findOne(id) {
        return await this.attendanceService.findOne(id);
    }
    async update(id, updateAttendanceDto) {
        return await this.attendanceService.update(id, updateAttendanceDto);
    }
    async remove(id) {
        return await this.attendanceService.remove(id);
    }
};
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new attendance record' }),
    ApiResponse({ status: 201, description: 'Attendance record created successfully.', type: AttendanceResponseDto }),
    ApiResponse({ status: 400, description: 'Bad request - Invalid input data.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' }),
    ApiResponse({ status: 409, description: 'Conflict - Attendance record already exists.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAttendanceDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Get all attendance records' }),
    ApiResponse({ status: 200, description: 'Returns all attendance records.', type: [AttendanceResponseDto] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findAll", null);
__decorate([
    Get('group/:groupId'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get attendance records by group ID' }),
    ApiParam({ name: 'groupId', description: 'Group ID', type: 'string' }),
    ApiResponse({ status: 200, description: 'Returns attendance records for the specified group.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Group not found.' }),
    __param(0, Param('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findByGroup", null);
__decorate([
    Get('student/:studentId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get attendance records by student ID' }),
    ApiParam({ name: 'studentId', description: 'Student ID', type: 'string' }),
    ApiResponse({ status: 200, description: 'Returns attendance records for the specified student.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Student not found.' }),
    __param(0, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findByStudent", null);
__decorate([
    Get('teacher/:teacherId'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get attendance records by teacher ID' }),
    ApiParam({ name: 'teacherId', description: 'Teacher ID', type: 'string' }),
    ApiResponse({ status: 200, description: 'Returns attendance records for the specified teacher.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Teacher not found.' }),
    __param(0, Param('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findByTeacher", null);
__decorate([
    Get('status/:status'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get attendance records by status' }),
    ApiParam({ name: 'status', description: 'Attendance status (present, absent, late)', enum: ['present', 'absent', 'late'] }),
    ApiResponse({ status: 200, description: 'Returns attendance records with the specified status.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findByStatus", null);
__decorate([
    Get('daterange'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get attendance records by date range' }),
    ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)', type: 'string' }),
    ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)', type: 'string' }),
    ApiResponse({ status: 200, description: 'Returns attendance records within the specified date range.' }),
    ApiResponse({ status: 400, description: 'Bad request - Invalid date format.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Query('startDate')),
    __param(1, Query('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findByDateRange", null);
__decorate([
    Get('group/:groupId/daterange'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get attendance records by group ID and date range' }),
    ApiParam({ name: 'groupId', description: 'Group ID', type: 'string' }),
    ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)', type: 'string' }),
    ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)', type: 'string' }),
    ApiResponse({ status: 200, description: 'Returns attendance records for the specified group within the date range.' }),
    ApiResponse({ status: 400, description: 'Bad request - Invalid date format or group ID.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Group not found.' }),
    __param(0, Param('groupId')),
    __param(1, Query('startDate')),
    __param(2, Query('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findByGroupAndDateRange", null);
__decorate([
    Get('student/:studentId/daterange'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get attendance records by student ID and date range' }),
    ApiParam({ name: 'studentId', description: 'Student ID', type: 'string' }),
    ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)', type: 'string' }),
    ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)', type: 'string' }),
    ApiResponse({ status: 200, description: 'Returns attendance records for the specified student within the date range.' }),
    ApiResponse({ status: 400, description: 'Bad request - Invalid date format or student ID.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Student not found.' }),
    __param(0, Param('studentId')),
    __param(1, Query('startDate')),
    __param(2, Query('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findByStudentAndDateRange", null);
__decorate([
    Get('stats/summary'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get attendance statistics' }),
    ApiQuery({ name: 'groupId', description: 'Group ID (optional)', type: 'string', required: false }),
    ApiQuery({ name: 'studentId', description: 'Student ID (optional)', type: 'string', required: false }),
    ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD) (optional)', type: 'string', required: false }),
    ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD) (optional)', type: 'string', required: false }),
    ApiResponse({ status: 200, description: 'Returns attendance statistics.', type: AttendanceStatsDto }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Query('groupId')),
    __param(1, Query('studentId')),
    __param(2, Query('startDate')),
    __param(3, Query('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceStats", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get attendance record by ID' }),
    ApiParam({ name: 'id', description: 'Attendance record ID', type: 'string' }),
    ApiResponse({ status: 200, description: 'Returns the attendance record.', type: AttendanceResponseDto }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Attendance record not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update attendance record' }),
    ApiParam({ name: 'id', description: 'Attendance record ID', type: 'string' }),
    ApiResponse({ status: 200, description: 'Attendance record updated successfully.', type: AttendanceResponseDto }),
    ApiResponse({ status: 400, description: 'Bad request - Invalid input data.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Attendance record not found.' }),
    ApiResponse({ status: 409, description: 'Conflict - Attendance record already exists.' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateAttendanceDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "update", null);
__decorate([
    Delete(':id'),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete attendance record' }),
    ApiParam({ name: 'id', description: 'Attendance record ID', type: 'string' }),
    ApiResponse({ status: 204, description: 'Attendance record deleted successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' }),
    ApiResponse({ status: 404, description: 'Attendance record not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "remove", null);
AttendanceController = __decorate([
    ApiTags('Attendance'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('attendance'),
    __metadata("design:paramtypes", [AttendanceService])
], AttendanceController);
export { AttendanceController };
//# sourceMappingURL=attendance.controller.js.map