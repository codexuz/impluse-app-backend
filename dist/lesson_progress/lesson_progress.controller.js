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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { LessonProgressService } from './lesson_progress.service.js';
import { CreateLessonProgressDto } from './dto/create-lesson-progress.dto.js';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto.js';
import { LessonProgress } from './entities/lesson_progress.entity.js';
let LessonProgressController = class LessonProgressController {
    constructor(lessonProgressService) {
        this.lessonProgressService = lessonProgressService;
    }
    create(createLessonProgressDto) {
        return this.lessonProgressService.create(createLessonProgressDto);
    }
    findAll() {
        return this.lessonProgressService.findAll();
    }
    findByStudentId(studentId) {
        return this.lessonProgressService.findByStudentId(studentId);
    }
    getStudentOverallProgress(studentId) {
        return this.lessonProgressService.getStudentOverallProgress(studentId);
    }
    findByLessonId(lessonId) {
        return this.lessonProgressService.findByLessonId(lessonId);
    }
    findByStudentAndLesson(studentId, lessonId) {
        return this.lessonProgressService.findByStudentAndLesson(studentId, lessonId);
    }
    getDetailedProgress(studentId, lessonId) {
        return this.lessonProgressService.getProgressByLessonAndStudent(studentId, lessonId);
    }
    updateSectionProgress(studentId, lessonId, section) {
        return this.lessonProgressService.updateSectionProgress(studentId, lessonId, section);
    }
    updateFromHomeworkSubmission(studentId, homeworkId, section) {
        return this.lessonProgressService.updateProgressFromHomeworkSubmission(studentId, homeworkId, section);
    }
    findOne(id) {
        return this.lessonProgressService.findOne(id);
    }
    update(id, updateLessonProgressDto) {
        return this.lessonProgressService.update(id, updateLessonProgressDto);
    }
    remove(id) {
        return this.lessonProgressService.remove(id);
    }
    getSectionProgressStats() {
        return this.lessonProgressService.getSectionProgressStats();
    }
    getStudentSectionProgressStats(studentId) {
        return this.lessonProgressService.getStudentSectionProgressStats(studentId);
    }
    getLessonSectionProgressStats(lessonId) {
        return this.lessonProgressService.getLessonSectionProgressStats(lessonId);
    }
    getAverageSectionProgress() {
        return this.lessonProgressService.getAverageSectionProgress();
    }
    getTopPerformingStudentsBySection(section, limit) {
        const limitNumber = limit ? parseInt(limit) : 10;
        return this.lessonProgressService.getTopPerformingStudentsBySection(section, limitNumber);
    }
    getComprehensiveProgressReport() {
        return this.lessonProgressService.getComprehensiveProgressReport();
    }
    getStudentComparisonStats(body) {
        return this.lessonProgressService.getStudentComparisonStats(body.student_ids);
    }
    getProgressTrends(days) {
        const daysNumber = days ? parseInt(days) : 30;
        return this.lessonProgressService.getProgressTrends(daysNumber);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new lesson progress record' }),
    ApiResponse({ status: 201, type: LessonProgress }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateLessonProgressDto]),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "create", null);
__decorate([
    Get(),
    ApiOperation({ summary: 'Get all lesson progress records' }),
    ApiResponse({ status: 200, type: [LessonProgress] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "findAll", null);
__decorate([
    Get('student/:studentId'),
    ApiOperation({ summary: 'Get lesson progress by student ID' }),
    ApiResponse({ status: 200, type: [LessonProgress] }),
    __param(0, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "findByStudentId", null);
__decorate([
    Get('student/:studentId/overall'),
    ApiOperation({ summary: 'Get overall progress summary for student' }),
    ApiResponse({ status: 200 }),
    __param(0, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "getStudentOverallProgress", null);
__decorate([
    Get('lesson/:lessonId'),
    ApiOperation({ summary: 'Get lesson progress by lesson ID' }),
    ApiResponse({ status: 200, type: [LessonProgress] }),
    __param(0, Param('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "findByLessonId", null);
__decorate([
    Get('student/:studentId/lesson/:lessonId'),
    ApiOperation({ summary: 'Get lesson progress by student ID and lesson ID' }),
    ApiResponse({ status: 200, type: LessonProgress }),
    ApiResponse({ status: 404, description: 'Not found' }),
    __param(0, Param('studentId')),
    __param(1, Param('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "findByStudentAndLesson", null);
__decorate([
    Get('student/:studentId/lesson/:lessonId/detailed'),
    ApiOperation({ summary: 'Get detailed lesson progress with sections breakdown' }),
    ApiResponse({ status: 200 }),
    __param(0, Param('studentId')),
    __param(1, Param('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "getDetailedProgress", null);
__decorate([
    Post('student/:studentId/lesson/:lessonId/section/:section'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Update section progress for a lesson' }),
    ApiResponse({ status: 200, type: LessonProgress }),
    __param(0, Param('studentId')),
    __param(1, Param('lessonId')),
    __param(2, Param('section')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "updateSectionProgress", null);
__decorate([
    Post('update-from-homework/:studentId/:homeworkId/:section'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Update lesson progress based on homework submission' }),
    ApiResponse({ status: 200, type: LessonProgress }),
    __param(0, Param('studentId')),
    __param(1, Param('homeworkId')),
    __param(2, Param('section')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "updateFromHomeworkSubmission", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Get a lesson progress record by ID' }),
    ApiResponse({ status: 200, type: LessonProgress }),
    ApiResponse({ status: 404, description: 'Not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update a lesson progress record' }),
    ApiResponse({ status: 200, type: LessonProgress }),
    ApiResponse({ status: 404, description: 'Not found' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateLessonProgressDto]),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete a lesson progress record' }),
    ApiResponse({ status: 200 }),
    ApiResponse({ status: 404, description: 'Not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "remove", null);
__decorate([
    Get('stats/section-progress'),
    ApiOperation({ summary: 'Get overall section progress statistics' }),
    ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "getSectionProgressStats", null);
__decorate([
    Get('stats/student/:studentId/sections'),
    ApiOperation({ summary: 'Get section progress statistics for a specific student' }),
    ApiResponse({ status: 200 }),
    __param(0, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "getStudentSectionProgressStats", null);
__decorate([
    Get('stats/lesson/:lessonId/sections'),
    ApiOperation({ summary: 'Get section progress statistics for a specific lesson' }),
    ApiResponse({ status: 200 }),
    __param(0, Param('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "getLessonSectionProgressStats", null);
__decorate([
    Get('stats/average-progress'),
    ApiOperation({ summary: 'Get average progress across all sections' }),
    ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "getAverageSectionProgress", null);
__decorate([
    Get('stats/top-performers/:section'),
    ApiOperation({ summary: 'Get top performing students by section' }),
    ApiResponse({ status: 200 }),
    __param(0, Param('section')),
    __param(1, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "getTopPerformingStudentsBySection", null);
__decorate([
    Get('stats/comprehensive-report'),
    ApiOperation({ summary: 'Get comprehensive progress report with all statistics' }),
    ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "getComprehensiveProgressReport", null);
__decorate([
    Post('stats/compare-students'),
    ApiOperation({ summary: 'Compare progress between multiple students' }),
    ApiResponse({ status: 200 }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "getStudentComparisonStats", null);
__decorate([
    Get('stats/trends'),
    ApiOperation({ summary: 'Get progress trends over time' }),
    ApiResponse({ status: 200 }),
    __param(0, Query('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonProgressController.prototype, "getProgressTrends", null);
LessonProgressController = __decorate([
    ApiTags('lesson-progress'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('lesson-progress'),
    __metadata("design:paramtypes", [LessonProgressService])
], LessonProgressController);
export { LessonProgressController };
//# sourceMappingURL=lesson_progress.controller.js.map