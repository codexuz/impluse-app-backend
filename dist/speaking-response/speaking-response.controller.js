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
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SpeakingResponseService } from './speaking-response.service.js';
import { CreateSpeakingResponseDto } from './dto/create-speaking-response.dto.js';
import { UpdateSpeakingResponseDto } from './dto/update-speaking-response.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { SpeakingResponse } from './entities/speaking-response.entity.js';
let SpeakingResponseController = class SpeakingResponseController {
    constructor(speakingResponseService) {
        this.speakingResponseService = speakingResponseService;
    }
    async create(createSpeakingResponseDto) {
        return this.speakingResponseService.create(createSpeakingResponseDto);
    }
    async findAll() {
        return this.speakingResponseService.findAll();
    }
    async findBySpeakingId(speakingId) {
        return this.speakingResponseService.findBySpeakingId(speakingId);
    }
    async findByType(responseType) {
        return this.speakingResponseService.findByType(responseType);
    }
    async findByStudentId(studentId) {
        return this.speakingResponseService.findByStudentId(studentId);
    }
    async checkSubmission(lessonId, studentId) {
        return this.speakingResponseService.checkSubmission(lessonId, studentId);
    }
    async findOne(id) {
        return this.speakingResponseService.findOne(id);
    }
    async update(id, updateSpeakingResponseDto) {
        return this.speakingResponseService.update(id, updateSpeakingResponseDto);
    }
    async remove(id) {
        return this.speakingResponseService.remove(id);
    }
};
__decorate([
    Post(),
    ApiOperation({
        summary: 'Create a new speaking response',
        description: 'Create a new speaking response with one or more audio URLs'
    }),
    ApiResponse({
        status: 201,
        description: 'The speaking response has been successfully created.',
        type: SpeakingResponse
    }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSpeakingResponseDto]),
    __metadata("design:returntype", Promise)
], SpeakingResponseController.prototype, "create", null);
__decorate([
    Get(),
    ApiOperation({ summary: 'Get all speaking responses' }),
    ApiResponse({
        status: 200,
        description: 'Return all speaking responses',
        type: [SpeakingResponse]
    }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SpeakingResponseController.prototype, "findAll", null);
__decorate([
    Get('speaking/:speakingId'),
    ApiOperation({ summary: 'Get all speaking responses for a specific speaking ID' }),
    ApiParam({ name: 'speakingId', description: 'The speaking ID to filter by' }),
    ApiResponse({
        status: 200,
        description: 'Returns all speaking responses for the specified speaking ID',
        type: [SpeakingResponse]
    }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('speakingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpeakingResponseController.prototype, "findBySpeakingId", null);
__decorate([
    Get('type/:responseType'),
    ApiOperation({ summary: 'Get all speaking responses of a specific type' }),
    ApiParam({ name: 'responseType', description: 'The response type to filter by' }),
    ApiResponse({
        status: 200,
        description: 'Returns all speaking responses of the specified type',
        type: [SpeakingResponse]
    }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('responseType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpeakingResponseController.prototype, "findByType", null);
__decorate([
    Get('student/:studentId'),
    ApiOperation({ summary: 'Get all speaking responses for a specific student' }),
    ApiParam({ name: 'studentId', description: 'The student ID to filter by' }),
    ApiResponse({
        status: 200,
        description: 'Returns all speaking responses for the specified student',
        type: [SpeakingResponse]
    }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpeakingResponseController.prototype, "findByStudentId", null);
__decorate([
    Get('check-submission'),
    ApiOperation({ summary: 'Get exercise details with completion status for a lesson' }),
    ApiQuery({ name: 'lessonId', description: 'The lesson ID to check', required: true }),
    ApiQuery({ name: 'studentId', description: 'The student ID to check', required: true }),
    ApiResponse({
        status: 200,
        description: 'Returns exercise details with completion status for the lesson',
        type: (Array)
    }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Query('lessonId')),
    __param(1, Query('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SpeakingResponseController.prototype, "checkSubmission", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Get a speaking response by ID' }),
    ApiParam({ name: 'id', description: 'The speaking response ID' }),
    ApiResponse({
        status: 200,
        description: 'Returns the speaking response',
        type: SpeakingResponse
    }),
    ApiResponse({ status: 404, description: 'Speaking response not found.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpeakingResponseController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    ApiOperation({ summary: 'Update a speaking response' }),
    ApiParam({ name: 'id', description: 'The speaking response ID to update' }),
    ApiResponse({
        status: 200,
        description: 'The speaking response has been successfully updated.',
        type: SpeakingResponse
    }),
    ApiResponse({ status: 404, description: 'Speaking response not found.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateSpeakingResponseDto]),
    __metadata("design:returntype", Promise)
], SpeakingResponseController.prototype, "update", null);
__decorate([
    Delete(':id'),
    ApiOperation({ summary: 'Delete a speaking response' }),
    ApiParam({ name: 'id', description: 'The speaking response ID to delete' }),
    ApiResponse({ status: 200, description: 'The speaking response has been successfully deleted.' }),
    ApiResponse({ status: 404, description: 'Speaking response not found.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpeakingResponseController.prototype, "remove", null);
SpeakingResponseController = __decorate([
    ApiTags('speaking-responses'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
    Controller('speaking-responses'),
    __metadata("design:paramtypes", [SpeakingResponseService])
], SpeakingResponseController);
export { SpeakingResponseController };
//# sourceMappingURL=speaking-response.controller.js.map