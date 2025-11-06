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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, } from '@nestjs/common';
import { ExamResultsService } from './exam-results.service.js';
import { CreateExamResultDto } from './dto/create-exam-result.dto.js';
import { UpdateExamResultDto } from './dto/update-exam-result.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, } from '@nestjs/swagger';
let ExamResultsController = class ExamResultsController {
    constructor(examResultsService) {
        this.examResultsService = examResultsService;
    }
    create(createExamResultDto) {
        return this.examResultsService.create(createExamResultDto);
    }
    findAll() {
        return this.examResultsService.findAll();
    }
    findOne(id) {
        return this.examResultsService.findOne(id);
    }
    findByExam(examId) {
        return this.examResultsService.findByExam(examId);
    }
    findByStudent(studentId) {
        return this.examResultsService.findByStudent(studentId);
    }
    findByExamAndStudent(examId, studentId) {
        return this.examResultsService.findByExamAndStudent(examId, studentId);
    }
    getExamStatistics(examId) {
        return this.examResultsService.getExamStatistics(examId);
    }
    update(id, updateExamResultDto) {
        return this.examResultsService.update(id, updateExamResultDto);
    }
    remove(id) {
        return this.examResultsService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: 'Create a new exam result' }),
    ApiResponse({ status: 201, description: 'The exam result has been successfully created' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateExamResultDto]),
    __metadata("design:returntype", void 0)
], ExamResultsController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all exam results' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExamResultsController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get a specific exam result by ID' }),
    ApiParam({ name: 'id', description: 'Exam result ID' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamResultsController.prototype, "findOne", null);
__decorate([
    Get('exam/:examId'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all results for a specific exam' }),
    ApiParam({ name: 'examId', description: 'Exam ID' }),
    __param(0, Param('examId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamResultsController.prototype, "findByExam", null);
__decorate([
    Get('student/:studentId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all exam results for a specific student' }),
    ApiParam({ name: 'studentId', description: 'Student ID' }),
    __param(0, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamResultsController.prototype, "findByStudent", null);
__decorate([
    Get('exam/:examId/student/:studentId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get exam result for a specific exam and student' }),
    ApiParam({ name: 'examId', description: 'Exam ID' }),
    ApiParam({ name: 'studentId', description: 'Student ID' }),
    __param(0, Param('examId')),
    __param(1, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ExamResultsController.prototype, "findByExamAndStudent", null);
__decorate([
    Get('exam/:examId/statistics'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get statistics for a specific exam' }),
    ApiParam({ name: 'examId', description: 'Exam ID' }),
    __param(0, Param('examId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamResultsController.prototype, "getExamStatistics", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update an exam result' }),
    ApiParam({ name: 'id', description: 'Exam result ID' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateExamResultDto]),
    __metadata("design:returntype", void 0)
], ExamResultsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: 'Delete an exam result' }),
    ApiParam({ name: 'id', description: 'Exam result ID' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamResultsController.prototype, "remove", null);
ExamResultsController = __decorate([
    ApiTags('Exam Results'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('exam-results'),
    __metadata("design:paramtypes", [ExamResultsService])
], ExamResultsController);
export { ExamResultsController };
//# sourceMappingURL=exam-results.controller.js.map