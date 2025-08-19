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
import { LessonContentService } from './lesson-content.service.js';
import { CreateLessonContentDto } from './dto/create-lesson-content.dto.js';
import { UpdateLessonContentDto } from './dto/update-lesson-content.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
let LessonContentController = class LessonContentController {
    constructor(lessonContentService) {
        this.lessonContentService = lessonContentService;
    }
    create(createLessonContentDto) {
        return this.lessonContentService.create(createLessonContentDto);
    }
    findAll() {
        return this.lessonContentService.findAll();
    }
    findOne(id) {
        return this.lessonContentService.findOne(id);
    }
    findByLessonId(lessonId) {
        return this.lessonContentService.findByLessonId(lessonId);
    }
    update(id, updateLessonContentDto) {
        return this.lessonContentService.update(id, updateLessonContentDto);
    }
    remove(id) {
        return this.lessonContentService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new lesson content' }),
    ApiResponse({ status: 201, description: 'The lesson content has been created successfully.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateLessonContentDto]),
    __metadata("design:returntype", void 0)
], LessonContentController.prototype, "create", null);
__decorate([
    Get(),
    ApiOperation({ summary: 'Get all lesson contents' }),
    ApiResponse({ status: 200, description: 'Return all active lesson contents.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LessonContentController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Get a lesson content by id' }),
    ApiResponse({ status: 200, description: 'Return the lesson content.' }),
    ApiResponse({ status: 404, description: 'Lesson content not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonContentController.prototype, "findOne", null);
__decorate([
    Get('lesson/:lessonId'),
    ApiOperation({ summary: 'Get all lesson contents by lesson ID' }),
    ApiResponse({ status: 200, description: 'Returns all lesson contents for the specified lesson.' }),
    ApiResponse({ status: 404, description: 'No content found for the specified lesson.' }),
    __param(0, Param('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonContentController.prototype, "findByLessonId", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update a lesson content' }),
    ApiResponse({ status: 200, description: 'The lesson content has been updated successfully.' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateLessonContentDto]),
    __metadata("design:returntype", void 0)
], LessonContentController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Soft delete a lesson content' }),
    ApiResponse({ status: 200, description: 'The lesson content has been deactivated successfully.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonContentController.prototype, "remove", null);
LessonContentController = __decorate([
    ApiTags('lesson-content'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
    Controller('lesson-content'),
    __metadata("design:paramtypes", [LessonContentService])
], LessonContentController);
export { LessonContentController };
//# sourceMappingURL=lesson-content.controller.js.map