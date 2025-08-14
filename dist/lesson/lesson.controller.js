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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';
import { LessonService } from './lesson.service.js';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';
import { Lesson } from './entities/lesson.entity.js';
let LessonController = class LessonController {
    constructor(lessonService) {
        this.lessonService = lessonService;
    }
    create(createLessonDto) {
        return this.lessonService.create(createLessonDto);
    }
    findAll() {
        return this.lessonService.findAll();
    }
    findMyLessons(student_id) {
        return this.lessonService.findMyLessons(student_id);
    }
    findOne(id) {
        return this.lessonService.findOne(id);
    }
    findWithContent(id) {
        return this.lessonService.findOneWithContent(id);
    }
    findWithVocabulary(id) {
        return this.lessonService.findOneWithVocabulary(id);
    }
    findWithExercise(id) {
        return this.lessonService.findOneWithExercises(id);
    }
    update(id, updateLessonDto) {
        return this.lessonService.update(id, updateLessonDto);
    }
    remove(id) {
        return this.lessonService.remove(id);
    }
    findByUnit(unitId, throwIfEmpty) {
        const shouldThrow = throwIfEmpty === 'true';
        return this.lessonService.findByUnit(unitId, shouldThrow);
    }
    findByModule(moduleId, includeContent) {
        const shouldIncludeContent = includeContent === 'true';
        return this.lessonService.findByModuleId(moduleId, shouldIncludeContent);
    }
    findByModuleWithContent(moduleId) {
        return this.lessonService.findByModuleId(moduleId, true);
    }
    findByModuleWithExercises(moduleId) {
        return this.lessonService.findByModuleIdWithExercises(moduleId);
    }
    findByModuleWithVocabulary(moduleId) {
        return this.lessonService.findByModuleIdWithVocabulary(moduleId);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new lesson' }),
    ApiResponse({
        status: 201,
        description: 'The lesson has been successfully created.',
        type: Lesson
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateLessonDto]),
    __metadata("design:returntype", void 0)
], LessonController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all lessons' }),
    ApiResponse({
        status: 200,
        description: 'Returns all lessons',
        type: [Lesson]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LessonController.prototype, "findAll", null);
__decorate([
    Get('my-lessons/:student_id'),
    Roles(Role.STUDENT),
    ApiOperation({ summary: 'Get lessons assigned to a student' }),
    ApiResponse({
        status: 200,
        description: 'Returns lessons assigned to the student',
        type: [Lesson]
    }),
    __param(0, Param('student_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonController.prototype, "findMyLessons", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get a specific lesson by ID' }),
    ApiResponse({
        status: 200,
        description: 'Returns the lesson',
        type: Lesson
    }),
    ApiResponse({ status: 404, description: 'Lesson not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonController.prototype, "findOne", null);
__decorate([
    Get(':id/content'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get a lesson with its content' }),
    ApiResponse({
        status: 200,
        description: 'Returns the lesson with content',
        type: Lesson
    }),
    ApiResponse({ status: 404, description: 'Lesson not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonController.prototype, "findWithContent", null);
__decorate([
    Get(':id/vocabulary'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get a lesson with its vocabulary sets' }),
    ApiResponse({
        status: 200,
        description: 'Returns the lesson with vocabulary sets',
        type: Lesson
    }),
    ApiResponse({ status: 404, description: 'Lesson not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonController.prototype, "findWithVocabulary", null);
__decorate([
    Get(':id/exercise'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get a lesson with its exercises' }),
    ApiResponse({
        status: 200,
        description: 'Returns the lesson with exercises',
        type: Lesson
    }),
    ApiResponse({ status: 404, description: 'Lesson not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonController.prototype, "findWithExercise", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update a lesson' }),
    ApiResponse({
        status: 200,
        description: 'The lesson has been successfully updated.',
        type: Lesson
    }),
    ApiResponse({ status: 404, description: 'Lesson not found' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateLessonDto]),
    __metadata("design:returntype", void 0)
], LessonController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Delete a lesson' }),
    ApiResponse({ status: 200, description: 'The lesson has been successfully deleted.' }),
    ApiResponse({ status: 404, description: 'Lesson not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonController.prototype, "remove", null);
__decorate([
    Get('unit/:unitId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all lessons for a specific unit' }),
    ApiParam({ name: 'unitId', description: 'Unit ID', type: 'string' }),
    ApiQuery({ name: 'throwIfEmpty', required: false, type: 'boolean', description: 'Throw error if no lessons found' }),
    ApiResponse({
        status: 200,
        description: 'Returns all lessons for the unit',
        type: [Lesson]
    }),
    ApiResponse({ status: 404, description: 'Unit not found' }),
    __param(0, Param('unitId')),
    __param(1, Query('throwIfEmpty')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LessonController.prototype, "findByUnit", null);
__decorate([
    Get('module/:moduleId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all lessons for a specific module' }),
    ApiParam({ name: 'moduleId', description: 'Module ID', type: 'string' }),
    ApiQuery({ name: 'includeContent', required: false, type: 'boolean', description: 'Include lesson content' }),
    ApiResponse({
        status: 200,
        description: 'Returns all lessons for the module',
        type: [Lesson]
    }),
    __param(0, Param('moduleId')),
    __param(1, Query('includeContent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LessonController.prototype, "findByModule", null);
__decorate([
    Get('module/:moduleId/with-content'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all lessons for a specific module with content' }),
    ApiParam({ name: 'moduleId', description: 'Module ID', type: 'string' }),
    ApiResponse({
        status: 200,
        description: 'Returns all lessons for the module with lesson content',
        type: [Lesson]
    }),
    __param(0, Param('moduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonController.prototype, "findByModuleWithContent", null);
__decorate([
    Get('module/:moduleId/with-exercises'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all lessons for a specific module with exercises' }),
    ApiParam({ name: 'moduleId', description: 'Module ID', type: 'string' }),
    ApiResponse({
        status: 200,
        description: 'Returns all lessons for the module with exercises',
        type: [Lesson]
    }),
    __param(0, Param('moduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonController.prototype, "findByModuleWithExercises", null);
__decorate([
    Get('module/:moduleId/with-vocabulary'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all lessons for a specific module with vocabulary' }),
    ApiParam({ name: 'moduleId', description: 'Module ID', type: 'string' }),
    ApiResponse({
        status: 200,
        description: 'Returns all lessons for the module with vocabulary sets',
        type: [Lesson]
    }),
    __param(0, Param('moduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonController.prototype, "findByModuleWithVocabulary", null);
LessonController = __decorate([
    ApiTags('lessons'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('lessons'),
    __metadata("design:paramtypes", [LessonService])
], LessonController);
export { LessonController };
//# sourceMappingURL=lesson.controller.js.map