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
import { Ieltspart1QuestionService } from './ieltspart1-question.service.js';
import { CreateIeltspart1QuestionDto } from './dto/create-ieltspart1-question.dto.js';
import { UpdateIeltspart1QuestionDto } from './dto/update-ieltspart1-question.dto.js';
import { Ieltspart1Question } from './entities/ieltspart1-question.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';
let Ieltspart1QuestionController = class Ieltspart1QuestionController {
    constructor(ieltspart1QuestionService) {
        this.ieltspart1QuestionService = ieltspart1QuestionService;
    }
    async create(createIeltspart1QuestionDto) {
        return await this.ieltspart1QuestionService.create(createIeltspart1QuestionDto);
    }
    async findAll() {
        return await this.ieltspart1QuestionService.findAll();
    }
    async findBySpeaking(speakingId) {
        return await this.ieltspart1QuestionService.findBySpeakingId(speakingId);
    }
    async findOne(id) {
        return await this.ieltspart1QuestionService.findOne(id);
    }
    async update(id, updateIeltspart1QuestionDto) {
        return await this.ieltspart1QuestionService.update(id, updateIeltspart1QuestionDto);
    }
    async remove(id) {
        return await this.ieltspart1QuestionService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new IELTS Part 1 question' }),
    ApiResponse({ status: 201, description: 'The question has been successfully created.', type: Ieltspart1Question }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateIeltspart1QuestionDto]),
    __metadata("design:returntype", Promise)
], Ieltspart1QuestionController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all IELTS Part 1 questions' }),
    ApiResponse({ status: 200, description: 'Return all IELTS Part 1 questions.', type: [Ieltspart1Question] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Ieltspart1QuestionController.prototype, "findAll", null);
__decorate([
    Get('speaking/:speakingId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all questions for a specific speaking test' }),
    ApiResponse({ status: 200, description: 'Return all questions for the speaking test.', type: [Ieltspart1Question] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('speakingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Ieltspart1QuestionController.prototype, "findBySpeaking", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get a specific IELTS Part 1 question' }),
    ApiResponse({ status: 200, description: 'Return the IELTS Part 1 question.', type: Ieltspart1Question }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Question not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Ieltspart1QuestionController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update an IELTS Part 1 question' }),
    ApiResponse({ status: 200, description: 'The question has been successfully updated.', type: Ieltspart1Question }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Question not found.' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateIeltspart1QuestionDto]),
    __metadata("design:returntype", Promise)
], Ieltspart1QuestionController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Delete an IELTS Part 1 question' }),
    ApiResponse({ status: 200, description: 'The question has been successfully deleted.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Question not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Ieltspart1QuestionController.prototype, "remove", null);
Ieltspart1QuestionController = __decorate([
    ApiTags('IELTS Part 1 Questions'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('ieltspart1-question'),
    __metadata("design:paramtypes", [Ieltspart1QuestionService])
], Ieltspart1QuestionController);
export { Ieltspart1QuestionController };
//# sourceMappingURL=ieltspart1-question.controller.js.map