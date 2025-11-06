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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { TeacherWalletService } from './teacher-wallet.service.js';
import { CreateTeacherWalletDto } from './dto/create-teacher-wallet.dto.js';
import { UpdateTeacherWalletDto } from './dto/update-teacher-wallet.dto.js';
import { UpdateWalletAmountDto } from './dto/update-wallet-amount.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
let TeacherWalletController = class TeacherWalletController {
    constructor(teacherWalletService) {
        this.teacherWalletService = teacherWalletService;
    }
    create(createTeacherWalletDto) {
        return this.teacherWalletService.create(createTeacherWalletDto);
    }
    findAll() {
        return this.teacherWalletService.findAll();
    }
    findByTeacherId(teacherId) {
        return this.teacherWalletService.findByTeacherId(teacherId);
    }
    findOne(id) {
        return this.teacherWalletService.findOne(id);
    }
    update(id, updateTeacherWalletDto) {
        return this.teacherWalletService.update(id, updateTeacherWalletDto);
    }
    updateAmount(id, updateWalletAmountDto) {
        return this.teacherWalletService.updateAmount(id, updateWalletAmountDto);
    }
    remove(id) {
        return this.teacherWalletService.remove(id);
    }
};
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Create a new teacher wallet' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTeacherWalletDto]),
    __metadata("design:returntype", void 0)
], TeacherWalletController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Get all teacher wallets' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TeacherWalletController.prototype, "findAll", null);
__decorate([
    Get('teacher/:teacherId'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get wallet by teacher ID' }),
    ApiParam({ name: 'teacherId', description: 'Teacher ID (UUID)', type: 'string' }),
    __param(0, Param('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeacherWalletController.prototype, "findByTeacherId", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get teacher wallet by ID' }),
    ApiParam({ name: 'id', description: 'Wallet ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeacherWalletController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Update teacher wallet' }),
    ApiParam({ name: 'id', description: 'Wallet ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateTeacherWalletDto]),
    __metadata("design:returntype", void 0)
], TeacherWalletController.prototype, "update", null);
__decorate([
    Patch(':id/amount'),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Add or deduct amount from teacher wallet' }),
    ApiParam({ name: 'id', description: 'Wallet ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateWalletAmountDto]),
    __metadata("design:returntype", void 0)
], TeacherWalletController.prototype, "updateAmount", null);
__decorate([
    Delete(':id'),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete teacher wallet (soft delete)' }),
    ApiParam({ name: 'id', description: 'Wallet ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeacherWalletController.prototype, "remove", null);
TeacherWalletController = __decorate([
    ApiTags('Teacher Wallet'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('teacher-wallet'),
    __metadata("design:paramtypes", [TeacherWalletService])
], TeacherWalletController);
export { TeacherWalletController };
//# sourceMappingURL=teacher-wallet.controller.js.map