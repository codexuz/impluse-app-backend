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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, } from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, } from "@nestjs/swagger";
import { HomeworkSubmissionsService } from "./homework_submissions.service.js";
import { CreateHomeworkSubmissionDto } from "./dto/create-homework-submission.dto.js";
import { UpdateHomeworkSubmissionDto } from "./dto/update-homework-submission.dto.js";
import { UpdateHomeworkSectionDto } from "./dto/update-homework-section.dto.js";
import { HomeworkSubmission } from "./entities/homework_submission.entity.js";
import { HomeworkSubmissionResponseDto, HomeworkSectionResponseDto, HomeworkSubmissionWithSectionResponseDto, } from "./dto/homework-submission-response.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../auth/constants/roles.js";
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
    async findByGroup(groupId) {
        return await this.homeworkSubmissionsService.findHomeworksByGroupId(groupId);
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
    async updateSection(sectionId, updateData) {
        return await this.homeworkSubmissionsService.updateSection(sectionId, updateData);
    }
    async checkWritingAnswers(sectionId, taskType) {
        return await this.homeworkSubmissionsService.checkWritingAnswers(sectionId, taskType);
    }
    async bulkCheckWritingAnswers(requestBody) {
        return await this.homeworkSubmissionsService.bulkCheckWritingAnswers(requestBody.sectionIds, requestBody.taskType);
    }
    async remove(id) {
        return await this.homeworkSubmissionsService.remove(id);
    }
    async getExercisesWithScores(studentId, homeworkId, section) {
        return await this.homeworkSubmissionsService.getExercisesWithScoresByStudentAndHomework(studentId, homeworkId, section);
    }
    async getStudentHomeworkStats(studentId, startDate, endDate) {
        return await this.homeworkSubmissionsService.getStudentHomeworkStatsBySection(studentId, startDate, endDate);
    }
    async getStudentAverageSpeakingScore(studentId) {
        return await this.homeworkSubmissionsService.getStudentAverageSpeakingScore(studentId);
    }
    async getHomeworkSectionsBySpeaking(speakingId, studentId) {
        return await this.homeworkSubmissionsService.getHomeworkSectionsBySpeakingId(speakingId, studentId);
    }
};
__decorate([
    Post(),
    Roles(Role.STUDENT),
    ApiOperation({ summary: "Create a new homework submission" }),
    ApiResponse({
        status: 201,
        description: "The homework submission has been successfully created.",
        type: HomeworkSubmissionWithSectionResponseDto,
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 403, description: "Forbidden." }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateHomeworkSubmissionDto]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "create", null);
__decorate([
    Post("section"),
    Roles(Role.STUDENT),
    ApiOperation({
        summary: "Save homework submission by section (creates new or updates existing)",
    }),
    ApiResponse({
        status: 201,
        description: "The homework submission has been successfully saved.",
        type: HomeworkSubmissionWithSectionResponseDto,
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 403, description: "Forbidden." }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateHomeworkSubmissionDto]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "saveBySection", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Get all homework submissions" }),
    ApiResponse({
        status: 200,
        description: "Return all homework submissions.",
        type: [HomeworkSubmissionResponseDto],
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "findAll", null);
__decorate([
    Get("homework/:homeworkId"),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Get all submissions for a specific homework" }),
    ApiResponse({
        status: 200,
        description: "Return all submissions for the homework.",
        type: [HomeworkSubmission],
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    __param(0, Param("homeworkId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "findByHomework", null);
__decorate([
    Get("student/:studentId"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: "Get all submissions by a specific student" }),
    ApiResponse({
        status: 200,
        description: "Return all submissions by the student.",
        type: [HomeworkSubmission],
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    __param(0, Param("studentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "findByStudent", null);
__decorate([
    Get("group/:groupId"),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({
        summary: "Get all submissions by students in a specific group",
    }),
    ApiResponse({
        status: 200,
        description: "Return all submissions by students in the group.",
        type: [HomeworkSubmission],
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 403, description: "Forbidden." }),
    __param(0, Param("groupId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "findByGroup", null);
__decorate([
    Get("student/:studentId/homework/:homeworkId"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({
        summary: "Get a specific submission by student and homework",
    }),
    ApiResponse({
        status: 200,
        description: "Return the submission.",
        type: HomeworkSubmission,
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 404, description: "Submission not found." }),
    __param(0, Param("studentId")),
    __param(1, Param("homeworkId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "findByStudentAndHomework", null);
__decorate([
    Get("section/:section"),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Get all submissions by section" }),
    ApiResponse({
        status: 200,
        description: "Return all submissions for the specified section.",
        type: [HomeworkSectionResponseDto],
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    __param(0, Param("section")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "findBySection", null);
__decorate([
    Get("student/:studentId/section/:section"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: "Get all submissions by student and section" }),
    ApiResponse({
        status: 200,
        description: "Return all submissions by the student for the specified section.",
        type: [HomeworkSectionResponseDto],
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    __param(0, Param("studentId")),
    __param(1, Param("section")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "findByStudentAndSection", null);
__decorate([
    Get("homework/:homeworkId/section/:section"),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Get all submissions by homework and section" }),
    ApiResponse({
        status: 200,
        description: "Return all submissions for the homework and section.",
        type: [HomeworkSectionResponseDto],
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    __param(0, Param("homeworkId")),
    __param(1, Param("section")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "findByHomeworkAndSection", null);
__decorate([
    Get("student/:studentId/homework/:homeworkId/section/:section"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({
        summary: "Get specific submission by student, homework, and section",
    }),
    ApiResponse({
        status: 200,
        description: "Return the submission.",
        type: HomeworkSectionResponseDto,
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 404, description: "Submission not found." }),
    __param(0, Param("studentId")),
    __param(1, Param("homeworkId")),
    __param(2, Param("section")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "findByStudentHomeworkAndSection", null);
__decorate([
    Get(":id"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: "Get a homework submission by id" }),
    ApiResponse({
        status: 200,
        description: "Return the homework submission.",
        type: HomeworkSubmission,
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 404, description: "Submission not found." }),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "findOne", null);
__decorate([
    Patch(":id"),
    Roles(Role.STUDENT),
    ApiOperation({ summary: "Update a homework submission" }),
    ApiResponse({
        status: 200,
        description: "The submission has been successfully updated.",
        type: HomeworkSubmission,
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 403, description: "Forbidden." }),
    ApiResponse({ status: 404, description: "Submission not found." }),
    __param(0, Param("id")),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateHomeworkSubmissionDto]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "update", null);
__decorate([
    Patch(":id/feedback"),
    Roles(Role.TEACHER),
    ApiOperation({ summary: "Add/Update feedback for a homework submission" }),
    ApiResponse({
        status: 200,
        description: "The feedback has been successfully updated.",
        type: HomeworkSubmission,
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 403, description: "Forbidden." }),
    ApiResponse({ status: 404, description: "Submission not found." }),
    __param(0, Param("id")),
    __param(1, Body("feedback")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "updateFeedback", null);
__decorate([
    Patch(":id/status"),
    Roles(Role.TEACHER),
    ApiOperation({ summary: "Update the status of a homework submission" }),
    ApiResponse({
        status: 200,
        description: "The status has been successfully updated.",
        type: HomeworkSubmission,
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 403, description: "Forbidden." }),
    ApiResponse({ status: 404, description: "Submission not found." }),
    __param(0, Param("id")),
    __param(1, Body("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "updateStatus", null);
__decorate([
    Patch("sections/:sectionId"),
    Roles(Role.TEACHER, Role.ADMIN),
    ApiOperation({
        summary: "Update a homework section",
        description: "Update section score, answers, or speaking_id. Automatically updates lesson progress if passing score (>=60).",
    }),
    ApiResponse({
        status: 200,
        description: "The section has been successfully updated.",
        type: HomeworkSectionResponseDto,
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 403, description: "Forbidden." }),
    ApiResponse({ status: 404, description: "Section not found." }),
    __param(0, Param("sectionId")),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateHomeworkSectionDto]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "updateSection", null);
__decorate([
    Post("sections/:sectionId/check-writing"),
    Roles(Role.TEACHER, Role.ADMIN),
    ApiOperation({
        summary: "Check writing answers using AI writing assessment",
        description: "Uses OpenAI writing checker bot to assess student's writing, provides feedback in Uzbek, and updates the score automatically.",
    }),
    ApiResponse({
        status: 200,
        description: "Writing has been successfully assessed and scored.",
        type: HomeworkSectionResponseDto,
        schema: {
            example: {
                id: "section-123",
                score: 75,
                answers: {
                    writing: "Student's writing response...",
                    assessment: {
                        score: 75,
                        grammarScore: 70,
                        vocabularyScore: 80,
                        coherenceScore: 75,
                        taskResponseScore: 80,
                        grammarFeedback: "Grammatika bo'yicha maslahatlar...",
                        vocabularyFeedback: "Lug'at boyligi bo'yicha...",
                        overallFeedback: "Umumiy baho va tavsiyalar...",
                        correctedText: "Corrected version...",
                        assessedAt: "2025-11-04T10:30:00.000Z",
                    },
                },
            },
        },
    }),
    ApiResponse({
        status: 400,
        description: "Invalid section type or no writing content found.",
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 403, description: "Forbidden." }),
    ApiResponse({ status: 404, description: "Section not found." }),
    __param(0, Param("sectionId")),
    __param(1, Query("taskType")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "checkWritingAnswers", null);
__decorate([
    Post("sections/bulk-check-writing"),
    Roles(Role.TEACHER, Role.ADMIN),
    ApiOperation({
        summary: "Bulk check writing answers for multiple sections",
        description: "Processes multiple writing sections at once using AI assessment. Returns success/failure status for each section.",
    }),
    ApiResponse({
        status: 200,
        description: "Bulk writing assessment completed.",
        schema: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    sectionId: { type: "string" },
                    success: { type: "boolean" },
                    section: { $ref: "#/components/schemas/HomeworkSectionResponseDto" },
                    error: { type: "string" },
                },
            },
            example: [
                {
                    sectionId: "section-1",
                    success: true,
                    section: {},
                },
                {
                    sectionId: "section-2",
                    success: false,
                    error: "No writing content found",
                },
            ],
        },
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 403, description: "Forbidden." }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "bulkCheckWritingAnswers", null);
__decorate([
    Delete(":id"),
    Roles(Role.ADMIN),
    ApiOperation({ summary: "Delete a homework submission" }),
    ApiResponse({
        status: 200,
        description: "The submission has been successfully deleted.",
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 403, description: "Forbidden." }),
    ApiResponse({ status: 404, description: "Submission not found." }),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "remove", null);
__decorate([
    Get("student/:studentId/homework/:homeworkId/exercises"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({
        summary: "Get exercises with scores by student ID and homework ID",
        description: 'Optional "section" query parameter can be used to filter by section type (reading, listening, grammar, writing, speaking)',
    }),
    ApiResponse({
        status: 200,
        description: "Return exercises with scores and completion status.",
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 403, description: "Forbidden." }),
    __param(0, Param("studentId")),
    __param(1, Param("homeworkId")),
    __param(2, Query("section")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "getExercisesWithScores", null);
__decorate([
    Get("student/:studentId/stats"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({
        summary: "Get student's homework statistics average by section type over time",
        description: "If startDate and endDate query parameters are not provided, defaults to the last month of data",
    }),
    ApiResponse({
        status: 200,
        description: "Return homework statistics with averages by section.",
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 403, description: "Forbidden." }),
    __param(0, Param("studentId")),
    __param(1, Query("startDate")),
    __param(2, Query("endDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "getStudentHomeworkStats", null);
__decorate([
    Get("student/:studentId/average-speaking-score"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({
        summary: "Get student's average speaking score across all speaking tasks",
        description: "Calculates the average pronunciation score from all speaking responses submitted by the student",
    }),
    ApiResponse({
        status: 200,
        description: "Return the average speaking score.",
        type: Number,
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 403, description: "Forbidden." }),
    __param(0, Param("studentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "getStudentAverageSpeakingScore", null);
__decorate([
    Get("speaking/:speakingId"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({
        summary: "Get homework sections by speaking exercise ID",
        description: "Returns homework sections with answers for a specific speaking exercise",
    }),
    ApiResponse({
        status: 200,
        description: "Return speaking answers and submissions.",
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 403, description: "Forbidden." }),
    __param(0, Param("speakingId")),
    __param(1, Query("studentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HomeworkSubmissionsController.prototype, "getHomeworkSectionsBySpeaking", null);
HomeworkSubmissionsController = __decorate([
    ApiTags("Homework Submissions"),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller("homework-submissions"),
    __metadata("design:paramtypes", [HomeworkSubmissionsService])
], HomeworkSubmissionsController);
export { HomeworkSubmissionsController };
//# sourceMappingURL=homework_submissions.controller.js.map