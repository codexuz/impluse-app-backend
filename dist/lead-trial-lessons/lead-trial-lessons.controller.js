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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpCode, HttpStatus, } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, } from "@nestjs/swagger";
import { LeadTrialLessonsService } from "./lead-trial-lessons.service.js";
import { CreateLeadTrialLessonDto } from "./dto/create-lead-trial-lesson.dto.js";
import { UpdateLeadTrialLessonDto } from "./dto/update-lead-trial-lesson.dto.js";
import { TrialLessonResponseDto, TrialLessonListResponseDto, TrialLessonStatsResponseDto, } from "./dto/trial-lesson-response.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { Role } from "../roles/role.enum.js";
let LeadTrialLessonsController = class LeadTrialLessonsController {
    constructor(leadTrialLessonsService) {
        this.leadTrialLessonsService = leadTrialLessonsService;
    }
    create(createLeadTrialLessonDto) {
        return this.leadTrialLessonsService.create(createLeadTrialLessonDto);
    }
    findAll(page = 1, limit = 10, search, status, teacherId) {
        return this.leadTrialLessonsService.findAll(+page, +limit, search, status, teacherId);
    }
    getStats() {
        return this.leadTrialLessonsService.getTrialLessonStats();
    }
    findUpcoming(limit = 20) {
        return this.leadTrialLessonsService.findUpcoming(+limit);
    }
    findByStatus(status) {
        return this.leadTrialLessonsService.findByStatus(status);
    }
    findByTeacher(teacherId) {
        return this.leadTrialLessonsService.findByTeacher(teacherId);
    }
    async findByLead(leadId) {
        return this.leadTrialLessonsService.findByLead(leadId);
    }
    getMyLessons(user) {
        return this.leadTrialLessonsService.findByTeacher(user.userId);
    }
    findOne(id) {
        return this.leadTrialLessonsService.findOne(id);
    }
    update(id, updateLeadTrialLessonDto) {
        return this.leadTrialLessonsService.update(id, updateLeadTrialLessonDto);
    }
    remove(id) {
        return this.leadTrialLessonsService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN),
    ApiOperation({ summary: "Create a new trial lesson" }),
    ApiResponse({
        status: 201,
        description: "Trial lesson created successfully",
        type: TrialLessonResponseDto,
    }),
    ApiResponse({ status: 400, description: "Bad request" }),
    ApiResponse({ status: 401, description: "Unauthorized" }),
    ApiResponse({
        status: 403,
        description: "Forbidden - Admin or Manager role required",
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateLeadTrialLessonDto]),
    __metadata("design:returntype", void 0)
], LeadTrialLessonsController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN),
    ApiOperation({
        summary: "Get all trial lessons with pagination and filtering",
    }),
    ApiQuery({
        name: "page",
        required: false,
        type: Number,
        description: "Page number (default: 1)",
    }),
    ApiQuery({
        name: "limit",
        required: false,
        type: Number,
        description: "Items per page (default: 10)",
    }),
    ApiQuery({
        name: "search",
        required: false,
        type: String,
        description: "Search in notes",
    }),
    ApiQuery({
        name: "status",
        required: false,
        type: String,
        description: "Filter by status",
    }),
    ApiQuery({
        name: "teacherId",
        required: false,
        type: String,
        description: "Filter by teacher ID",
    }),
    ApiResponse({
        status: 200,
        description: "Trial lessons retrieved successfully",
        type: TrialLessonListResponseDto,
    }),
    ApiResponse({ status: 401, description: "Unauthorized" }),
    ApiResponse({
        status: 403,
        description: "Forbidden - Admin, Manager, or Teacher role required",
    }),
    __param(0, Query("page")),
    __param(1, Query("limit")),
    __param(2, Query("search")),
    __param(3, Query("status")),
    __param(4, Query("teacherId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String]),
    __metadata("design:returntype", void 0)
], LeadTrialLessonsController.prototype, "findAll", null);
__decorate([
    Get("stats"),
    Roles(Role.ADMIN),
    ApiOperation({ summary: "Get trial lesson statistics" }),
    ApiResponse({
        status: 200,
        description: "Trial lesson statistics retrieved successfully",
        type: TrialLessonStatsResponseDto,
    }),
    ApiResponse({ status: 401, description: "Unauthorized" }),
    ApiResponse({
        status: 403,
        description: "Forbidden - Admin or Manager role required",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LeadTrialLessonsController.prototype, "getStats", null);
__decorate([
    Get("upcoming"),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Get upcoming trial lessons" }),
    ApiQuery({
        name: "limit",
        required: false,
        type: Number,
        description: "Maximum number of results (default: 20)",
    }),
    ApiResponse({
        status: 200,
        description: "Upcoming trial lessons retrieved successfully",
        type: [TrialLessonResponseDto],
    }),
    ApiResponse({ status: 401, description: "Unauthorized" }),
    ApiResponse({
        status: 403,
        description: "Forbidden - Admin, Manager, or Teacher role required",
    }),
    __param(0, Query("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeadTrialLessonsController.prototype, "findUpcoming", null);
__decorate([
    Get("by-status/:status"),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Get trial lessons by status" }),
    ApiParam({ name: "status", description: "Trial lesson status" }),
    ApiResponse({
        status: 200,
        description: "Trial lessons by status retrieved successfully",
        type: [TrialLessonResponseDto],
    }),
    ApiResponse({ status: 401, description: "Unauthorized" }),
    ApiResponse({
        status: 403,
        description: "Forbidden - Admin, Manager, or Teacher role required",
    }),
    __param(0, Param("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeadTrialLessonsController.prototype, "findByStatus", null);
__decorate([
    Get("by-teacher/:teacherId"),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Get trial lessons by teacher" }),
    ApiParam({ name: "teacherId", description: "Teacher ID" }),
    ApiResponse({
        status: 200,
        description: "Trial lessons by teacher retrieved successfully",
        type: [TrialLessonResponseDto],
    }),
    ApiResponse({ status: 401, description: "Unauthorized" }),
    ApiResponse({
        status: 403,
        description: "Forbidden - Admin, Manager, or Teacher role required",
    }),
    __param(0, Param("teacherId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeadTrialLessonsController.prototype, "findByTeacher", null);
__decorate([
    Get("by-lead/:leadId"),
    Roles(Role.ADMIN),
    ApiOperation({ summary: "Get trial lessons by lead" }),
    ApiParam({ name: "leadId", description: "Lead ID" }),
    ApiResponse({
        status: 200,
        description: "Trial lessons by lead retrieved successfully",
        type: [TrialLessonResponseDto],
    }),
    ApiResponse({ status: 401, description: "Unauthorized" }),
    ApiResponse({
        status: 403,
        description: "Forbidden - Admin, Manager, or Teacher role required",
    }),
    __param(0, Param("leadId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeadTrialLessonsController.prototype, "findByLead", null);
__decorate([
    Get("my-lessons"),
    Roles(Role.TEACHER),
    ApiOperation({ summary: "Get trial lessons assigned to current teacher" }),
    ApiResponse({
        status: 200,
        description: "Teacher trial lessons retrieved successfully",
        type: [TrialLessonResponseDto],
    }),
    ApiResponse({ status: 401, description: "Unauthorized" }),
    ApiResponse({
        status: 403,
        description: "Forbidden - Teacher role required",
    }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeadTrialLessonsController.prototype, "getMyLessons", null);
__decorate([
    Get(":id"),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Get trial lesson by ID" }),
    ApiParam({ name: "id", description: "Trial lesson ID" }),
    ApiResponse({
        status: 200,
        description: "Trial lesson retrieved successfully",
        type: TrialLessonResponseDto,
    }),
    ApiResponse({ status: 404, description: "Trial lesson not found" }),
    ApiResponse({ status: 401, description: "Unauthorized" }),
    ApiResponse({
        status: 403,
        description: "Forbidden - Admin, Manager, or Teacher role required",
    }),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeadTrialLessonsController.prototype, "findOne", null);
__decorate([
    Patch(":id"),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Update trial lesson by ID" }),
    ApiParam({ name: "id", description: "Trial lesson ID" }),
    ApiResponse({
        status: 200,
        description: "Trial lesson updated successfully",
        type: TrialLessonResponseDto,
    }),
    ApiResponse({ status: 400, description: "Bad request" }),
    ApiResponse({ status: 404, description: "Trial lesson not found" }),
    ApiResponse({ status: 401, description: "Unauthorized" }),
    ApiResponse({
        status: 403,
        description: "Forbidden - Admin, Manager, or Teacher role required",
    }),
    __param(0, Param("id")),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateLeadTrialLessonDto]),
    __metadata("design:returntype", void 0)
], LeadTrialLessonsController.prototype, "update", null);
__decorate([
    Delete(":id"),
    Roles(Role.ADMIN),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: "Delete trial lesson by ID (soft delete)" }),
    ApiParam({ name: "id", description: "Trial lesson ID" }),
    ApiResponse({
        status: 204,
        description: "Trial lesson deleted successfully",
    }),
    ApiResponse({ status: 404, description: "Trial lesson not found" }),
    ApiResponse({ status: 401, description: "Unauthorized" }),
    ApiResponse({
        status: 403,
        description: "Forbidden - Admin or Manager role required",
    }),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeadTrialLessonsController.prototype, "remove", null);
LeadTrialLessonsController = __decorate([
    ApiTags("Lead Trial Lessons"),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller("lead-trial-lessons"),
    __metadata("design:paramtypes", [LeadTrialLessonsService])
], LeadTrialLessonsController);
export { LeadTrialLessonsController };
//# sourceMappingURL=lead-trial-lessons.controller.js.map