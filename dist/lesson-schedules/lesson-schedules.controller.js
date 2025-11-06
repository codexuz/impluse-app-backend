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
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, } from "@nestjs/swagger";
import { LessonSchedulesService } from "./lesson-schedules.service.js";
import { CreateLessonScheduleDto } from "./dto/create-lesson-schedule.dto.js";
import { UpdateLessonScheduleDto } from "./dto/update-lesson-schedule.dto.js";
import { LessonScheduleResponseDto } from "./dto/lesson-schedule-response.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";
let LessonSchedulesController = class LessonSchedulesController {
    constructor(lessonSchedulesService) {
        this.lessonSchedulesService = lessonSchedulesService;
    }
    async create(createLessonScheduleDto) {
        return await this.lessonSchedulesService.create(createLessonScheduleDto);
    }
    async findAll() {
        return await this.lessonSchedulesService.findAll();
    }
    async findActiveSchedules() {
        return await this.lessonSchedulesService.findActiveSchedules();
    }
    async findByGroup(groupId) {
        return await this.lessonSchedulesService.findByGroupId(groupId);
    }
    async findOne(id) {
        return await this.lessonSchedulesService.findOne(id);
    }
    async update(id, updateLessonScheduleDto) {
        return await this.lessonSchedulesService.update(id, updateLessonScheduleDto);
    }
    async remove(id) {
        return await this.lessonSchedulesService.remove(id);
    }
};
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Create a new lesson schedule" }),
    ApiResponse({
        status: 201,
        description: "Lesson schedule created successfully.",
        type: LessonScheduleResponseDto,
    }),
    ApiResponse({
        status: 400,
        description: "Bad request - Invalid input data.",
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({
        status: 403,
        description: "Forbidden - Insufficient permissions.",
    }),
    ApiResponse({
        status: 409,
        description: "Conflict - Overlapping schedule exists.",
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateLessonScheduleDto]),
    __metadata("design:returntype", Promise)
], LessonSchedulesController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Get all lesson schedules" }),
    ApiResponse({
        status: 200,
        description: "Returns all lesson schedules.",
        type: [LessonScheduleResponseDto],
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({
        status: 403,
        description: "Forbidden - Insufficient permissions.",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LessonSchedulesController.prototype, "findAll", null);
__decorate([
    Get("active"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({
        summary: "Get all active lesson schedules (current and future)",
    }),
    ApiResponse({
        status: 200,
        description: "Returns all active lesson schedules.",
        type: [LessonScheduleResponseDto],
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LessonSchedulesController.prototype, "findActiveSchedules", null);
__decorate([
    Get("group/:groupId"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: "Get lesson schedules by group ID" }),
    ApiParam({ name: "groupId", description: "Group ID", type: "string" }),
    ApiResponse({
        status: 200,
        description: "Returns lesson schedules for the specified group.",
        type: [LessonScheduleResponseDto],
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 404, description: "Group not found." }),
    __param(0, Param("groupId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LessonSchedulesController.prototype, "findByGroup", null);
__decorate([
    Get(":id"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: "Get lesson schedule by ID" }),
    ApiParam({ name: "id", description: "Lesson schedule ID", type: "string" }),
    ApiResponse({
        status: 200,
        description: "Returns the lesson schedule.",
        type: LessonScheduleResponseDto,
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 404, description: "Lesson schedule not found." }),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LessonSchedulesController.prototype, "findOne", null);
__decorate([
    Patch(":id"),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Update lesson schedule" }),
    ApiParam({ name: "id", description: "Lesson schedule ID", type: "string" }),
    ApiResponse({
        status: 200,
        description: "Lesson schedule updated successfully.",
        type: LessonScheduleResponseDto,
    }),
    ApiResponse({
        status: 400,
        description: "Bad request - Invalid input data.",
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({ status: 404, description: "Lesson schedule not found." }),
    ApiResponse({
        status: 409,
        description: "Conflict - Overlapping schedule exists.",
    }),
    __param(0, Param("id")),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateLessonScheduleDto]),
    __metadata("design:returntype", Promise)
], LessonSchedulesController.prototype, "update", null);
__decorate([
    Delete(":id"),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN),
    ApiOperation({ summary: "Delete lesson schedule" }),
    ApiParam({ name: "id", description: "Lesson schedule ID", type: "string" }),
    ApiResponse({
        status: 200,
        description: "Lesson schedule deleted successfully.",
    }),
    ApiResponse({ status: 401, description: "Unauthorized." }),
    ApiResponse({
        status: 403,
        description: "Forbidden - Admin access required.",
    }),
    ApiResponse({ status: 404, description: "Lesson schedule not found." }),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LessonSchedulesController.prototype, "remove", null);
LessonSchedulesController = __decorate([
    ApiTags("Lesson Schedules"),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller("lesson-schedules"),
    __metadata("design:paramtypes", [LessonSchedulesService])
], LessonSchedulesController);
export { LessonSchedulesController };
//# sourceMappingURL=lesson-schedules.controller.js.map