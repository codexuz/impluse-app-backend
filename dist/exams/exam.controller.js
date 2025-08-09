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
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ExamService } from './exam.service.js';
import { CreateExamDto } from './dto/create-exam.dto.js';
import { UpdateExamDto } from './dto/update-exam.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
let ExamController = class ExamController {
    constructor(examService) {
        this.examService = examService;
    }
    create(createExamDto) {
        return this.examService.create(createExamDto);
    }
    findAll() {
        return this.examService.findAll();
    }
    getByUserId(userId) {
        return this.examService.getByUserId(userId);
    }
    findOne(id) {
        return this.examService.findOne(id);
    }
    update(id, updateExamDto) {
        return this.examService.update(id, updateExamDto);
    }
    remove(id) {
        return this.examService.remove(id);
    }
    findByGroup(groupId) {
        return this.examService.findByGroup(groupId);
    }
    findByDateRange(startDate, endDate) {
        return this.examService.findByDateRange(new Date(startDate), new Date(endDate));
    }
    findByStatus(status) {
        return this.examService.findByStatus(status);
    }
    findByLevel(level) {
        return this.examService.findByLevel(level);
    }
};
__decorate([
    Post(),
    Roles('admin', 'teacher'),
    ApiOperation({ summary: 'Create a new exam' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateExamDto]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "create", null);
__decorate([
    Get(),
    Roles('admin', 'teacher'),
    ApiOperation({ summary: 'Get all exams' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "findAll", null);
__decorate([
    Get('user/:userId'),
    Roles('admin', 'teacher', 'student'),
    ApiOperation({ summary: 'Get exams by user ID (based on user\'s group memberships)' }),
    __param(0, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "getByUserId", null);
__decorate([
    Get(':id'),
    Roles('admin', 'teacher', 'student'),
    ApiOperation({ summary: 'Get exam by id' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "findOne", null);
__decorate([
    Put(':id'),
    Roles('admin', 'teacher'),
    ApiOperation({ summary: 'Update exam by id' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateExamDto]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles('admin'),
    ApiOperation({ summary: 'Delete exam by id' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "remove", null);
__decorate([
    Get('group/:groupId'),
    Roles('admin', 'teacher', 'student'),
    ApiOperation({ summary: 'Get exams by group id' }),
    __param(0, Param('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "findByGroup", null);
__decorate([
    Get('date-range'),
    Roles('admin', 'teacher', 'student'),
    ApiOperation({ summary: 'Get exams within date range' }),
    __param(0, Query('startDate')),
    __param(1, Query('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "findByDateRange", null);
__decorate([
    Get('status/:status'),
    Roles('admin', 'teacher', 'student'),
    ApiOperation({ summary: 'Get exams by status' }),
    __param(0, Param('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "findByStatus", null);
__decorate([
    Get('level/:level'),
    Roles('admin', 'teacher', 'student'),
    ApiOperation({ summary: 'Get exams by level' }),
    __param(0, Param('level')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "findByLevel", null);
ExamController = __decorate([
    ApiTags('Exams'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('exams'),
    __metadata("design:paramtypes", [ExamService])
], ExamController);
export { ExamController };
//# sourceMappingURL=exam.controller.js.map