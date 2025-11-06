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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { StudentTransactionService } from './student-transaction.service.js';
import { CreateStudentTransactionDto } from './dto/create-student-transaction.dto.js';
import { UpdateStudentTransactionDto } from './dto/update-student-transaction.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
let StudentTransactionController = class StudentTransactionController {
    constructor(studentTransactionService) {
        this.studentTransactionService = studentTransactionService;
    }
    create(createStudentTransactionDto) {
        return this.studentTransactionService.create(createStudentTransactionDto);
    }
    findAll(type) {
        return this.studentTransactionService.findAll(type);
    }
    findByStudentId(studentId, type) {
        return this.studentTransactionService.findByStudentId(studentId, type);
    }
    findOne(id) {
        return this.studentTransactionService.findOne(id);
    }
    update(id, updateStudentTransactionDto) {
        return this.studentTransactionService.update(id, updateStudentTransactionDto);
    }
    remove(id) {
        return this.studentTransactionService.remove(id);
    }
};
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new student transaction' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateStudentTransactionDto]),
    __metadata("design:returntype", void 0)
], StudentTransactionController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all student transactions' }),
    ApiQuery({ name: 'type', required: false, description: 'Filter by transaction type' }),
    __param(0, Query('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentTransactionController.prototype, "findAll", null);
__decorate([
    Get('student/:studentId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all transactions for a specific student' }),
    ApiParam({ name: 'studentId', description: 'Student ID (UUID)', type: 'string' }),
    ApiQuery({ name: 'type', required: false, description: 'Filter by transaction type' }),
    __param(0, Param('studentId')),
    __param(1, Query('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StudentTransactionController.prototype, "findByStudentId", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get student transaction by ID' }),
    ApiParam({ name: 'id', description: 'Transaction ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentTransactionController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Update student transaction' }),
    ApiParam({ name: 'id', description: 'Transaction ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateStudentTransactionDto]),
    __metadata("design:returntype", void 0)
], StudentTransactionController.prototype, "update", null);
__decorate([
    Delete(':id'),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete student transaction (soft delete)' }),
    ApiParam({ name: 'id', description: 'Transaction ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentTransactionController.prototype, "remove", null);
StudentTransactionController = __decorate([
    ApiTags('Student Transaction'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('student-transaction'),
    __metadata("design:paramtypes", [StudentTransactionService])
], StudentTransactionController);
export { StudentTransactionController };
//# sourceMappingURL=student-transaction.controller.js.map