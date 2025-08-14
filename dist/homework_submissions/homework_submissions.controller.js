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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HomeworkSubmissionsService } from './homework_submissions.service.js';
import { CreateHomeworkSubmissionDto } from './dto/create-homework-submission.dto.js';
import { UpdateHomeworkSubmissionDto } from './dto/update-homework-submission.dto.js';
import { HomeworkSubmission } from './entities/homework_submission.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';
let HomeworkSubmissionsController = class HomeworkSubmissionsController {
    constructor(homeworkSubmissionsService) {
        this.homeworkSubmissionsService = homeworkSubmissionsService;
    }
    async create(createHomeworkSubmissionDto) {
        return await this.homeworkSubmissionsService.create(createHomeworkSubmissionDto);
    }
    async saveBySection(createHomeworkSubmissionDto) {
        return await this.homeworkSubmissionsService.saveBySection(createHomeworkSubmissionDto);
    }
    async findAll() {
        return await this.homeworkSubmissionsService.findAll();
    }
    async findByHomework(homeworkId) {
        return await this.homeworkSubmissionsService.findByHomeworkId(homeworkId);
    }
    async findByStudent(studentId) {
        return await this.homeworkSubmissionsService.findByStudentId(studentId);
    }
    async findByStudentAndHomework(studentId, homeworkId) {
        return await this.homeworkSubmissionsService.findByStudentAndHomework(studentId, homeworkId);
    }
    async findBySection(section) {
        return await this.homeworkSubmissionsService.findBySection(section);
    }
    async findByStudentAndSection(studentId, section) {
        return await this.homeworkSubmissionsService.findByStudentAndSection(studentId, section);
    }
    async findByHomeworkAndSection(homeworkId, section) {
        return await this.homeworkSubmissionsService.findByHomeworkAndSection(homeworkId, section);
    }
    async findByStudentHomeworkAndSection(studentId, homeworkId, section) {
        return await this.homeworkSubmissionsService.findByStudentHomeworkAndSection(studentId, homeworkId, section);
    }
    async findOne(id) {
        return await this.homeworkSubmissionsService.findOne(id);
    }
    async update(id, updateHomeworkSubmissionDto) {
        return await this.homeworkSubmissionsService.update(id, updateHomeworkSubmissionDto);
    }
    async updateFeedback(id, feedback) {
        return await this.homeworkSubmissionsService.updateFeedback(id, feedback);
    }
    async updateStatus(id, status) {
        return await this.homeworkSubmissionsService.updateStatus(id, status);
    }
    async remove(id) {
        return await this.homeworkSubmissionsService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.STUDENT),
    ApiOperation({ summary: 'Create a new homework submission' }),
    ApiResponse({ status: 201, description: 'The homework submission has been successfully created.', type: HomeworkSubmission }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateHomeworkSubmissionDto]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "create", null);
__decorate([
    Post('section'),
    Roles(Role.STUDENT),
    ApiOperation({ summary: 'Save homework submission by section (creates new or updates existing)' }),
    ApiResponse({ status: 201, description: 'The homework submission has been successfully saved.', type: HomeworkSubmission }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateHomeworkSubmissionDto]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "saveBySection", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all homework submissions' }),
    ApiResponse({ status: 200, description: 'Return all homework submissions.', type: [HomeworkSubmission] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "findAll", null);
__decorate([
    Get('homework/:homeworkId'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all submissions for a specific homework' }),
    ApiResponse({ status: 200, description: 'Return all submissions for the homework.', type: [HomeworkSubmission] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('homeworkId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "findByHomework", null);
__decorate([
    Get('student/:studentId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all submissions by a specific student' }),
    ApiResponse({ status: 200, description: 'Return all submissions by the student.', type: [HomeworkSubmission] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "findByStudent", null);
__decorate([
    Get('student/:studentId/homework/:homeworkId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get a specific submission by student and homework' }),
    ApiResponse({ status: 200, description: 'Return the submission.', type: HomeworkSubmission }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Submission not found.' }),
    __param(0, Param('studentId')),
    __param(1, Param('homeworkId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "findByStudentAndHomework", null);
__decorate([
    Get('section/:section'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all submissions by section' }),
    ApiResponse({ status: 200, description: 'Return all submissions for the specified section.', type: [HomeworkSubmission] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('section')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "findBySection", null);
__decorate([
    Get('student/:studentId/section/:section'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all submissions by student and section' }),
    ApiResponse({ status: 200, description: 'Return all submissions by the student for the specified section.', type: [HomeworkSubmission] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('studentId')),
    __param(1, Param('section')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "findByStudentAndSection", null);
__decorate([
    Get('homework/:homeworkId/section/:section'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all submissions by homework and section' }),
    ApiResponse({ status: 200, description: 'Return all submissions for the homework and section.', type: [HomeworkSubmission] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('homeworkId')),
    __param(1, Param('section')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "findByHomeworkAndSection", null);
__decorate([
    Get('student/:studentId/homework/:homeworkId/section/:section'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get specific submission by student, homework, and section' }),
    ApiResponse({ status: 200, description: 'Return the submission.', type: HomeworkSubmission }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Submission not found.' }),
    __param(0, Param('studentId')),
    __param(1, Param('homeworkId')),
    __param(2, Param('section')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "findByStudentHomeworkAndSection", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get a homework submission by id' }),
    ApiResponse({ status: 200, description: 'Return the homework submission.', type: HomeworkSubmission }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Submission not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    Roles(Role.STUDENT),
    ApiOperation({ summary: 'Update a homework submission' }),
    ApiResponse({ status: 200, description: 'The submission has been successfully updated.', type: HomeworkSubmission }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Submission not found.' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateHomeworkSubmissionDto]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "update", null);
__decorate([
    Patch(':id/feedback'),
    Roles(Role.TEACHER),
    ApiOperation({ summary: 'Add/Update feedback for a homework submission' }),
    ApiResponse({ status: 200, description: 'The feedback has been successfully updated.', type: HomeworkSubmission }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Submission not found.' }),
    __param(0, Param('id')),
    __param(1, Body('feedback')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "updateFeedback", null);
__decorate([
    Patch(':id/status'),
    Roles(Role.TEACHER),
    ApiOperation({ summary: 'Update the status of a homework submission' }),
    ApiResponse({ status: 200, description: 'The status has been successfully updated.', type: HomeworkSubmission }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Submission not found.' }),
    __param(0, Param('id')),
    __param(1, Body('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "updateStatus", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete a homework submission' }),
    ApiResponse({ status: 200, description: 'The submission has been successfully deleted.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Submission not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "remove", null);
HomeworkSubmissionsController = __decorate([
    ApiTags('Homework Submissions'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('homework-submissions'),
    __metadata("design:paramtypes", [HomeworkSubmissionsService])
], HomeworkSubmissionsController);
export { HomeworkSubmissionsController };
//# sourceMappingURL=homework_submissions.controller.js.map