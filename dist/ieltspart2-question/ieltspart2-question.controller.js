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
import { Ieltspart2QuestionService } from './ieltspart2-question.service.js';
import { CreateIeltspart2QuestionDto } from './dto/create-ieltspart2-question.dto.js';
import { UpdateIeltspart2QuestionDto } from './dto/update-ieltspart2-question.dto.js';
import { Ieltspart2Question } from './entities/ieltspart2-question.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';
let Ieltspart2QuestionController = class Ieltspart2QuestionController {
    constructor(ieltspart2QuestionService) {
        this.ieltspart2QuestionService = ieltspart2QuestionService;
    }
    async create(createIeltspart2QuestionDto) {
        return await this.ieltspart2QuestionService.create(createIeltspart2QuestionDto);
    }
    async findAll() {
        return await this.ieltspart2QuestionService.findAll();
    }
    async findBySpeaking(speakingId) {
        return await this.ieltspart2QuestionService.findBySpeakingId(speakingId);
    }
    async findOne(id) {
        return await this.ieltspart2QuestionService.findOne(id);
    }
    async update(id, updateIeltspart2QuestionDto) {
        return await this.ieltspart2QuestionService.update(id, updateIeltspart2QuestionDto);
    }
    async remove(id) {
        return await this.ieltspart2QuestionService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new IELTS Part 2 question' }),
    ApiResponse({ status: 201, description: 'The question has been successfully created.', type: Ieltspart2Question }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateIeltspart2QuestionDto]),
    __metadata("design:returntype", Promise)
], Ieltspart2QuestionController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all IELTS Part 2 questions' }),
    ApiResponse({ status: 200, description: 'Return all IELTS Part 2 questions.', type: [Ieltspart2Question] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Ieltspart2QuestionController.prototype, "findAll", null);
__decorate([
    Get('speaking/:speakingId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all questions for a specific speaking test' }),
    ApiResponse({ status: 200, description: 'Return all questions for the speaking test.', type: [Ieltspart2Question] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('speakingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Ieltspart2QuestionController.prototype, "findBySpeaking", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get a specific IELTS Part 2 question' }),
    ApiResponse({ status: 200, description: 'Return the IELTS Part 2 question.', type: Ieltspart2Question }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Question not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Ieltspart2QuestionController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update an IELTS Part 2 question' }),
    ApiResponse({ status: 200, description: 'The question has been successfully updated.', type: Ieltspart2Question }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Question not found.' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateIeltspart2QuestionDto]),
    __metadata("design:returntype", Promise)
], Ieltspart2QuestionController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete an IELTS Part 2 question' }),
    ApiResponse({ status: 200, description: 'The question has been successfully deleted.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Question not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Ieltspart2QuestionController.prototype, "remove", null);
Ieltspart2QuestionController = __decorate([
    ApiTags('IELTS Part 2 Questions'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('ieltspart2-question'),
    __metadata("design:paramtypes", [Ieltspart2QuestionService])
], Ieltspart2QuestionController);
export { Ieltspart2QuestionController };
//# sourceMappingURL=ieltspart2-question.controller.js.map