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
import { Ieltspart3QuestionService } from './ieltspart3-question.service.js';
import { CreateIeltspart3QuestionDto } from './dto/create-ieltspart3-question.dto.js';
import { UpdateIeltspart3QuestionDto } from './dto/update-ieltspart3-question.dto.js';
import { Ieltspart3Question } from './entities/ieltspart3-question.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';
let Ieltspart3QuestionController = class Ieltspart3QuestionController {
    constructor(ieltspart3QuestionService) {
        this.ieltspart3QuestionService = ieltspart3QuestionService;
    }
    async create(createIeltspart3QuestionDto) {
        return await this.ieltspart3QuestionService.create(createIeltspart3QuestionDto);
    }
    async findAll() {
        return await this.ieltspart3QuestionService.findAll();
    }
    async findBySpeaking(speakingId) {
        return await this.ieltspart3QuestionService.findBySpeakingId(speakingId);
    }
    async findOne(id) {
        return await this.ieltspart3QuestionService.findOne(id);
    }
    async update(id, updateIeltspart3QuestionDto) {
        return await this.ieltspart3QuestionService.update(id, updateIeltspart3QuestionDto);
    }
    async remove(id) {
        return await this.ieltspart3QuestionService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new IELTS Part 3 question' }),
    ApiResponse({ status: 201, description: 'The question has been successfully created.', type: Ieltspart3Question }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateIeltspart3QuestionDto]),
    __metadata("design:returntype", Promise)
], Ieltspart3QuestionController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all IELTS Part 3 questions' }),
    ApiResponse({ status: 200, description: 'Return all IELTS Part 3 questions.', type: [Ieltspart3Question] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Ieltspart3QuestionController.prototype, "findAll", null);
__decorate([
    Get('speaking/:speakingId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all questions for a specific speaking test' }),
    ApiResponse({ status: 200, description: 'Return all questions for the speaking test.', type: [Ieltspart3Question] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('speakingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Ieltspart3QuestionController.prototype, "findBySpeaking", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get a specific IELTS Part 3 question' }),
    ApiResponse({ status: 200, description: 'Return the IELTS Part 3 question.', type: Ieltspart3Question }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Question not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Ieltspart3QuestionController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update an IELTS Part 3 question' }),
    ApiResponse({ status: 200, description: 'The question has been successfully updated.', type: Ieltspart3Question }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Question not found.' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateIeltspart3QuestionDto]),
    __metadata("design:returntype", Promise)
], Ieltspart3QuestionController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Delete an IELTS Part 3 question' }),
    ApiResponse({ status: 200, description: 'The question has been successfully deleted.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Question not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Ieltspart3QuestionController.prototype, "remove", null);
Ieltspart3QuestionController = __decorate([
    ApiTags('IELTS Part 3 Questions'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('ieltspart3-question'),
    __metadata("design:paramtypes", [Ieltspart3QuestionService])
], Ieltspart3QuestionController);
export { Ieltspart3QuestionController };
//# sourceMappingURL=ieltspart3-question.controller.js.map