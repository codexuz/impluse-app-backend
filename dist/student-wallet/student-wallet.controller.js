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
import { StudentWalletService } from './student-wallet.service.js';
import { CreateStudentWalletDto } from './dto/create-student-wallet.dto.js';
import { UpdateStudentWalletDto } from './dto/update-student-wallet.dto.js';
import { UpdateWalletAmountDto } from './dto/update-wallet-amount.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
let StudentWalletController = class StudentWalletController {
    constructor(studentWalletService) {
        this.studentWalletService = studentWalletService;
    }
    create(createStudentWalletDto) {
        return this.studentWalletService.create(createStudentWalletDto);
    }
    findAll() {
        return this.studentWalletService.findAll();
    }
    findByStudentId(studentId) {
        return this.studentWalletService.findByStudentId(studentId);
    }
    findOne(id) {
        return this.studentWalletService.findOne(id);
    }
    update(id, updateStudentWalletDto) {
        return this.studentWalletService.update(id, updateStudentWalletDto);
    }
    updateAmount(id, updateWalletAmountDto) {
        return this.studentWalletService.updateAmount(id, updateWalletAmountDto);
    }
    remove(id) {
        return this.studentWalletService.remove(id);
    }
};
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new student wallet' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateStudentWalletDto]),
    __metadata("design:returntype", void 0)
], StudentWalletController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all student wallets' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StudentWalletController.prototype, "findAll", null);
__decorate([
    Get('student/:studentId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get wallet by student ID' }),
    ApiParam({ name: 'studentId', description: 'Student ID (UUID)', type: 'string' }),
    __param(0, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentWalletController.prototype, "findByStudentId", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get student wallet by ID' }),
    ApiParam({ name: 'id', description: 'Wallet ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentWalletController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update student wallet' }),
    ApiParam({ name: 'id', description: 'Wallet ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateStudentWalletDto]),
    __metadata("design:returntype", void 0)
], StudentWalletController.prototype, "update", null);
__decorate([
    Patch(':id/amount'),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Add or deduct amount from student wallet' }),
    ApiParam({ name: 'id', description: 'Wallet ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateWalletAmountDto]),
    __metadata("design:returntype", void 0)
], StudentWalletController.prototype, "updateAmount", null);
__decorate([
    Delete(':id'),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete student wallet (soft delete)' }),
    ApiParam({ name: 'id', description: 'Wallet ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentWalletController.prototype, "remove", null);
StudentWalletController = __decorate([
    ApiTags('Student Wallet'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('student-wallet'),
    __metadata("design:paramtypes", [StudentWalletService])
], StudentWalletController);
export { StudentWalletController };
//# sourceMappingURL=student-wallet.controller.js.map