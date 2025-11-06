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
import { TeacherTransactionService } from './teacher-transaction.service.js';
import { CreateTeacherTransactionDto } from './dto/create-teacher-transaction.dto.js';
import { UpdateTeacherTransactionDto } from './dto/update-teacher-transaction.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
let TeacherTransactionController = class TeacherTransactionController {
    constructor(teacherTransactionService) {
        this.teacherTransactionService = teacherTransactionService;
    }
    create(createTeacherTransactionDto) {
        return this.teacherTransactionService.create(createTeacherTransactionDto);
    }
    findAll(type) {
        return this.teacherTransactionService.findAll(type);
    }
    findByTeacherId(teacherId, type) {
        return this.teacherTransactionService.findByTeacherId(teacherId, type);
    }
    findOne(id) {
        return this.teacherTransactionService.findOne(id);
    }
    update(id, updateTeacherTransactionDto) {
        return this.teacherTransactionService.update(id, updateTeacherTransactionDto);
    }
    remove(id) {
        return this.teacherTransactionService.remove(id);
    }
};
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Create a new teacher transaction' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTeacherTransactionDto]),
    __metadata("design:returntype", void 0)
], TeacherTransactionController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Get all teacher transactions' }),
    ApiQuery({ name: 'type', required: false, description: 'Filter by transaction type' }),
    __param(0, Query('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeacherTransactionController.prototype, "findAll", null);
__decorate([
    Get('teacher/:teacherId'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all transactions for a specific teacher' }),
    ApiParam({ name: 'teacherId', description: 'Teacher ID (UUID)', type: 'string' }),
    ApiQuery({ name: 'type', required: false, description: 'Filter by transaction type' }),
    __param(0, Param('teacherId')),
    __param(1, Query('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TeacherTransactionController.prototype, "findByTeacherId", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get teacher transaction by ID' }),
    ApiParam({ name: 'id', description: 'Transaction ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeacherTransactionController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Update teacher transaction' }),
    ApiParam({ name: 'id', description: 'Transaction ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateTeacherTransactionDto]),
    __metadata("design:returntype", void 0)
], TeacherTransactionController.prototype, "update", null);
__decorate([
    Delete(':id'),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete teacher transaction (soft delete)' }),
    ApiParam({ name: 'id', description: 'Transaction ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeacherTransactionController.prototype, "remove", null);
TeacherTransactionController = __decorate([
    ApiTags('Teacher Transaction'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('teacher-transaction'),
    __metadata("design:paramtypes", [TeacherTransactionService])
], TeacherTransactionController);
export { TeacherTransactionController };
//# sourceMappingURL=teacher-transaction.controller.js.map