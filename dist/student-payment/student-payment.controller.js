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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentPaymentService } from './student-payment.service.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CreateStudentPaymentDto } from './dto/create-student-payment.dto.js';
import { UpdateStudentPaymentDto } from './dto/update-student-payment.dto.js';
import { StudentPaymentStatusDto } from './dto/student-payment-status.dto.js';
import { DuePaymentsResponseDto } from './dto/due-payments.dto.js';
let StudentPaymentController = class StudentPaymentController {
    constructor(studentPaymentService) {
        this.studentPaymentService = studentPaymentService;
    }
    create(createStudentPaymentDto) {
        return this.studentPaymentService.create(createStudentPaymentDto);
    }
    findAll() {
        return this.studentPaymentService.findAll();
    }
    findByStudent(studentId) {
        return this.studentPaymentService.findByStudent(studentId);
    }
    async getStudentPaymentStatus(studentId) {
        return this.studentPaymentService.calculateStudentPaymentStatus(studentId);
    }
    findUpcomingPayments(days) {
        return this.studentPaymentService.findUpcomingPayments(days);
    }
    findByStatus(status) {
        return this.studentPaymentService.findByStatus(status);
    }
    findOne(id) {
        return this.studentPaymentService.findOne(id);
    }
    update(id, updateStudentPaymentDto) {
        return this.studentPaymentService.update(id, updateStudentPaymentDto);
    }
    updateStatus(id, status) {
        return this.studentPaymentService.updateStatus(id, status);
    }
    remove(id) {
        return this.studentPaymentService.remove(id);
    }
    async triggerPaymentCreation() {
        await this.studentPaymentService.handleAutomaticPaymentCreation();
        return { message: 'Payment creation job triggered successfully' };
    }
    async checkDuePayments() {
        return this.studentPaymentService.checkDuePayments();
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Create a new student payment' }),
    ApiResponse({ status: 201, description: 'Payment successfully created.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateStudentPaymentDto]),
    __metadata("design:returntype", void 0)
], StudentPaymentController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Get all student payments' }),
    ApiResponse({ status: 200, description: 'List of all payments.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StudentPaymentController.prototype, "findAll", null);
__decorate([
    Get('student/:studentId'),
    Roles(Role.ADMIN, Role.STUDENT),
    ApiOperation({ summary: 'Get all payments for a specific student' }),
    ApiResponse({ status: 200, description: 'List of student\'s payments.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    __param(0, Param('studentId', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentPaymentController.prototype, "findByStudent", null);
__decorate([
    Get('student/:studentId/status'),
    Roles(Role.ADMIN, Role.STUDENT),
    ApiOperation({ summary: 'Get payment status summary for a student' }),
    ApiResponse({
        status: 200,
        description: 'Payment status summary including totals and upcoming payment details.',
        type: StudentPaymentStatusDto
    }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'No payment records found for student.' }),
    __param(0, Param('studentId', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentPaymentController.prototype, "getStudentPaymentStatus", null);
__decorate([
    Get('upcoming'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Get upcoming payments within specified days' }),
    ApiResponse({ status: 200, description: 'List of upcoming payments.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    __param(0, Query('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], StudentPaymentController.prototype, "findUpcomingPayments", null);
__decorate([
    Get('status/:status'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Get payments by status' }),
    ApiResponse({ status: 200, description: 'List of payments with specified status.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    __param(0, Param('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentPaymentController.prototype, "findByStatus", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Get a specific payment' }),
    ApiResponse({ status: 200, description: 'Payment details.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Payment not found.' }),
    __param(0, Param('id', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentPaymentController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Update a payment' }),
    ApiResponse({ status: 200, description: 'Payment successfully updated.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Payment not found.' }),
    __param(0, Param('id', ParseUUIDPipe)),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateStudentPaymentDto]),
    __metadata("design:returntype", void 0)
], StudentPaymentController.prototype, "update", null);
__decorate([
    Patch(':id/status'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Update payment status' }),
    ApiResponse({ status: 200, description: 'Payment status successfully updated.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Payment not found.' }),
    __param(0, Param('id', ParseUUIDPipe)),
    __param(1, Body('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StudentPaymentController.prototype, "updateStatus", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete a payment' }),
    ApiResponse({ status: 204, description: 'Payment successfully deleted.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Payment not found.' }),
    HttpCode(HttpStatus.NO_CONTENT),
    __param(0, Param('id', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentPaymentController.prototype, "remove", null);
__decorate([
    Post('trigger-payment-creation'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Manually trigger the automatic payment creation (admin only)' }),
    ApiResponse({ status: 200, description: 'Payment creation job triggered successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StudentPaymentController.prototype, "triggerPaymentCreation", null);
__decorate([
    Get('check-due-payments'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Check which payments would be processed by the automatic payment job' }),
    ApiResponse({
        status: 200,
        description: 'List of payments that would be processed',
        type: DuePaymentsResponseDto
    }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StudentPaymentController.prototype, "checkDuePayments", null);
StudentPaymentController = __decorate([
    ApiTags('Student Payments'),
    Controller('student-payments'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [StudentPaymentService])
], StudentPaymentController);
export { StudentPaymentController };
//# sourceMappingURL=student-payment.controller.js.map