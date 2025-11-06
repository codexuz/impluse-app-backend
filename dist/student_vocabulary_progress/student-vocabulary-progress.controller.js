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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query, } from '@nestjs/common';
import { StudentVocabularyProgressService } from './student-vocabulary-progress.service.js';
import { CreateStudentVocabularyProgressDto } from './dto/create-student-vocabulary-progress.dto.js';
import { UpdateStudentVocabularyProgressDto } from './dto/update-student-vocabulary-progress.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { VocabularyProgressStatus } from './enums/vocabulary-progress-status.enum.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, } from '@nestjs/swagger';
let StudentVocabularyProgressController = class StudentVocabularyProgressController {
    constructor(progressService) {
        this.progressService = progressService;
    }
    create(createDto) {
        return this.progressService.create(createDto);
    }
    findAll() {
        return this.progressService.findAll();
    }
    findOne(id) {
        return this.progressService.findOne(id);
    }
    findByStudent(studentId) {
        return this.progressService.findByStudent(studentId);
    }
    findByVocabularyItem(vocabularyItemId) {
        return this.progressService.findByVocabularyItem(vocabularyItemId);
    }
    findByStudentAndVocabularyItem(studentId, vocabularyItemId) {
        return this.progressService.findByStudentAndVocabularyItem(studentId, vocabularyItemId);
    }
    update(id, updateDto) {
        return this.progressService.update(id, updateDto);
    }
    updateStatus(id, status) {
        return this.progressService.updateStatus(id, status);
    }
    updateStatusByVocabularyItemId(vocabularyItemId, status) {
        return this.progressService.updateStatusByVocabularyItemId(vocabularyItemId, status);
    }
    getStudentStats(studentId) {
        return this.progressService.getStudentProgressStats(studentId);
    }
    getDetailedStudentStats(studentId) {
        return this.progressService.getDetailedStudentStats(studentId);
    }
    getVocabularyItemStats(vocabularyItemId) {
        return this.progressService.getVocabularyItemStats(vocabularyItemId);
    }
    getGlobalStats() {
        return this.progressService.getGlobalStats();
    }
    getStudentRankings(limitParam) {
        const limit = limitParam ? parseInt(limitParam, 10) : 10;
        return this.progressService.getStudentRankings(limit);
    }
    getStudentEfficiencyRankings(limitParam) {
        const limit = limitParam ? parseInt(limitParam, 10) : 10;
        return this.progressService.getStudentEfficiencyRankings(limit);
    }
    getProgressTrends(daysParam) {
        const days = daysParam ? parseInt(daysParam, 10) : 30;
        return this.progressService.getProgressTrends(days);
    }
    incrementAttempts(id) {
        return this.progressService.incrementAttempts(id);
    }
    recordAttempt(studentId, vocabularyItemId, status) {
        return this.progressService.recordAttempt(studentId, vocabularyItemId, status);
    }
    remove(id) {
        return this.progressService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: 'Create a new vocabulary progress record' }),
    ApiResponse({ status: 201, description: 'Progress record created successfully' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateStudentVocabularyProgressDto]),
    __metadata("design:returntype", void 0)
], StudentVocabularyProgressController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all vocabulary progress records' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StudentVocabularyProgressController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get progress record by id' }),
    ApiParam({ name: 'id', description: 'Progress record ID' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentVocabularyProgressController.prototype, "findOne", null);
__decorate([
    Get('student/:studentId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all progress records for a student' }),
    ApiParam({ name: 'studentId', description: 'Student ID' }),
    __param(0, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentVocabularyProgressController.prototype, "findByStudent", null);
__decorate([
    Get('vocabulary/:vocabularyItemId'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all progress records for a vocabulary item' }),
    ApiParam({ name: 'vocabularyItemId', description: 'Vocabulary Item ID' }),
    __param(0, Param('vocabularyItemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentVocabularyProgressController.prototype, "findByVocabularyItem", null);
__decorate([
    Get('student/:studentId/vocabulary/:vocabularyItemId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get progress record for a specific student and vocabulary item' }),
    __param(0, Param('studentId')),
    __param(1, Param('vocabularyItemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StudentVocabularyProgressController.prototype, "findByStudentAndVocabularyItem", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Update progress record' }),
    ApiParam({ name: 'id', description: 'Progress record ID' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateStudentVocabularyProgressDto]),
    __metadata("design:returntype", void 0)
], StudentVocabularyProgressController.prototype, "update", null);
__decorate([
    Patch(':id/status/:status'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Update progress status' }),
    ApiParam({ name: 'id', description: 'Progress record ID' }),
    ApiParam({ name: 'status', enum: VocabularyProgressStatus }),
    __param(0, Param('id')),
    __param(1, Param('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StudentVocabularyProgressController.prototype, "updateStatus", null);
__decorate([
    Patch('vocabulary/:vocabularyItemId/status/:status'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Update status for all progress records of a vocabulary item' }),
    ApiParam({ name: 'vocabularyItemId', description: 'Vocabulary Item ID' }),
    ApiParam({ name: 'status', enum: VocabularyProgressStatus }),
    __param(0, Param('vocabularyItemId')),
    __param(1, Param('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StudentVocabularyProgressController.prototype, "updateStatusByVocabularyItemId", null);
__decorate([
    Get('stats/student/:studentId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get basic vocabulary progress statistics for a student' }),
    ApiParam({ name: 'studentId', description: 'Student ID' }),
    __param(0, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentVocabularyProgressController.prototype, "getStudentStats", null);
__decorate([
    Get('stats/student/:studentId/detailed'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get detailed vocabulary progress statistics for a student' }),
    ApiParam({ name: 'studentId', description: 'Student ID' }),
    __param(0, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentVocabularyProgressController.prototype, "getDetailedStudentStats", null);
__decorate([
    Get('stats/vocabulary/:vocabularyItemId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get vocabulary item statistics' }),
    ApiParam({ name: 'vocabularyItemId', description: 'Vocabulary Item ID' }),
    __param(0, Param('vocabularyItemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentVocabularyProgressController.prototype, "getVocabularyItemStats", null);
__decorate([
    Get('stats/global'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get global vocabulary progress statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StudentVocabularyProgressController.prototype, "getGlobalStats", null);
__decorate([
    Get('stats/rankings'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get student rankings based on vocabulary mastery' }),
    __param(0, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentVocabularyProgressController.prototype, "getStudentRankings", null);
__decorate([
    Get('stats/efficiency-rankings'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get student rankings based on learning efficiency (attempts to mastery)' }),
    __param(0, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentVocabularyProgressController.prototype, "getStudentEfficiencyRankings", null);
__decorate([
    Get('stats/trends'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get vocabulary progress trends over time' }),
    __param(0, Query('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentVocabularyProgressController.prototype, "getProgressTrends", null);
__decorate([
    Post(':id/increment-attempts'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Increment attempts count for a progress record' }),
    ApiParam({ name: 'id', description: 'Progress record ID' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentVocabularyProgressController.prototype, "incrementAttempts", null);
__decorate([
    Post('student/:studentId/vocabulary/:vocabularyItemId/record-attempt'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Record an attempt for a specific student and vocabulary item' }),
    ApiParam({ name: 'studentId', description: 'Student ID' }),
    ApiParam({ name: 'vocabularyItemId', description: 'Vocabulary Item ID' }),
    __param(0, Param('studentId')),
    __param(1, Param('vocabularyItemId')),
    __param(2, Query('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], StudentVocabularyProgressController.prototype, "recordAttempt", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: 'Delete progress record' }),
    ApiParam({ name: 'id', description: 'Progress record ID' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentVocabularyProgressController.prototype, "remove", null);
StudentVocabularyProgressController = __decorate([
    ApiTags('Student Vocabulary Progress'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('student-vocabulary-progress'),
    __metadata("design:paramtypes", [StudentVocabularyProgressService])
], StudentVocabularyProgressController);
export { StudentVocabularyProgressController };
//# sourceMappingURL=student-vocabulary-progress.controller.js.map