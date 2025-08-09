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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { LessonVocabularySetService } from './lesson_vocabulary_set.service.js';
import { CreateLessonVocabularySetDto } from './dto/create-lesson-vocabulary-set.dto.js';
import { UpdateLessonVocabularySetDto } from './dto/update-lesson-vocabulary-set.dto.js';
import { LessonVocabularySet } from './entities/lesson_vocabulary_set.entity.js';
let LessonVocabularySetController = class LessonVocabularySetController {
    constructor(lessonVocabularySetService) {
        this.lessonVocabularySetService = lessonVocabularySetService;
    }
    create(createLessonVocabularySetDto) {
        return this.lessonVocabularySetService.create(createLessonVocabularySetDto);
    }
    createMany(createLessonVocabularySetDtos) {
        return this.lessonVocabularySetService.createMany(createLessonVocabularySetDtos);
    }
    findAll() {
        return this.lessonVocabularySetService.findAll();
    }
    findOne(id) {
        return this.lessonVocabularySetService.findOne(id);
    }
    findByLessonId(lesson_id) {
        return this.lessonVocabularySetService.findByLessonId(lesson_id);
    }
    findByVocabularyItemId(vocabulary_item_id) {
        return this.lessonVocabularySetService.findByVocabularyItemId(vocabulary_item_id);
    }
    update(id, updateLessonVocabularySetDto) {
        return this.lessonVocabularySetService.update(id, updateLessonVocabularySetDto);
    }
    remove(id) {
        return this.lessonVocabularySetService.remove(id);
    }
    removeByLessonId(lesson_id) {
        return this.lessonVocabularySetService.removeByLessonId(lesson_id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new lesson vocabulary set' }),
    ApiResponse({
        status: 201,
        description: 'The lesson vocabulary set has been successfully created.',
        type: LessonVocabularySet
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateLessonVocabularySetDto]),
    __metadata("design:returntype", void 0)
], LessonVocabularySetController.prototype, "create", null);
__decorate([
    Post('bulk'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create multiple lesson vocabulary sets' }),
    ApiResponse({
        status: 201,
        description: 'The lesson vocabulary sets have been successfully created.',
        type: [LessonVocabularySet]
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], LessonVocabularySetController.prototype, "createMany", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all lesson vocabulary sets' }),
    ApiResponse({
        status: 200,
        description: 'Returns all lesson vocabulary sets',
        type: [LessonVocabularySet]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LessonVocabularySetController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get a specific lesson vocabulary set by ID' }),
    ApiResponse({
        status: 200,
        description: 'Returns the lesson vocabulary set',
        type: LessonVocabularySet
    }),
    ApiResponse({ status: 404, description: 'Set not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonVocabularySetController.prototype, "findOne", null);
__decorate([
    Get('lesson/:lesson_id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all vocabulary sets for a lesson' }),
    ApiResponse({
        status: 200,
        description: 'Returns all vocabulary sets for the specified lesson',
        type: [LessonVocabularySet]
    }),
    __param(0, Param('lesson_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonVocabularySetController.prototype, "findByLessonId", null);
__decorate([
    Get('vocabulary/:vocabulary_item_id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all lesson associations for a vocabulary item' }),
    ApiResponse({
        status: 200,
        description: 'Returns all lesson associations for the specified vocabulary item',
        type: [LessonVocabularySet]
    }),
    __param(0, Param('vocabulary_item_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonVocabularySetController.prototype, "findByVocabularyItemId", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update a lesson vocabulary set' }),
    ApiResponse({
        status: 200,
        description: 'The lesson vocabulary set has been successfully updated.',
        type: LessonVocabularySet
    }),
    ApiResponse({ status: 404, description: 'Set not found' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateLessonVocabularySetDto]),
    __metadata("design:returntype", void 0)
], LessonVocabularySetController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Delete a lesson vocabulary set' }),
    ApiResponse({ status: 200, description: 'The lesson vocabulary set has been successfully deleted.' }),
    ApiResponse({ status: 404, description: 'Set not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonVocabularySetController.prototype, "remove", null);
__decorate([
    Delete('lesson/:lesson_id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Delete all vocabulary sets for a lesson' }),
    ApiResponse({ status: 200, description: 'The vocabulary sets have been successfully deleted.' }),
    __param(0, Param('lesson_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonVocabularySetController.prototype, "removeByLessonId", null);
LessonVocabularySetController = __decorate([
    ApiTags('lesson-vocabulary-sets'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('lesson-vocabulary-sets'),
    __metadata("design:paramtypes", [LessonVocabularySetService])
], LessonVocabularySetController);
export { LessonVocabularySetController };
//# sourceMappingURL=lesson_vocabulary_set.controller.js.map