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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExerciseService } from './exercise.service.js';
import { CreateCompleteExerciseDto } from './dto/create-complete-exercise.dto.js';
import { UpdateExerciseDto } from './dto/update-complete-exercise.dto.js';
import { ExerciseResponseDto } from './dto/exercise-response.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';
let ExerciseController = class ExerciseController {
    constructor(exerciseService) {
        this.exerciseService = exerciseService;
    }
    async create(createExerciseDto) {
        return await this.exerciseService.create(createExerciseDto);
    }
    async findAll() {
        return await this.exerciseService.findAll();
    }
    async findByLessonId(lessonId) {
        return await this.exerciseService.findByLessonId(lessonId);
    }
    async findByType(exerciseType) {
        return await this.exerciseService.findByType(exerciseType);
    }
    async findByTypeAndLessonId(exerciseType, lessonId) {
        return await this.exerciseService.findByTypeAndLessonId(exerciseType, lessonId);
    }
    async findOne(id) {
        return await this.exerciseService.findOne(id);
    }
    async getQuestionsForExercise(exerciseId) {
        return await this.exerciseService.getQuestionsForExercise(exerciseId);
    }
    async update(id, updateExerciseDto) {
        return await this.exerciseService.update(id, updateExerciseDto);
    }
    async remove(id) {
        return await this.exerciseService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new complete exercise with all question types' }),
    ApiResponse({ status: 201, description: 'Exercise has been created successfully.', type: ExerciseResponseDto }),
    ApiResponse({ status: 400, description: 'Bad Request - Invalid exercise data.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCompleteExerciseDto]),
    __metadata("design:returntype", Promise)
], ExerciseController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all exercises' }),
    ApiResponse({ status: 200, description: 'Return all active exercises.', type: [ExerciseResponseDto] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExerciseController.prototype, "findAll", null);
__decorate([
    Get('lesson/:lessonId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all exercises for a lesson' }),
    ApiResponse({ status: 200, description: 'Return all exercises for the specified lesson.', type: [ExerciseResponseDto] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExerciseController.prototype, "findByLessonId", null);
__decorate([
    Get('type/:exerciseType'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get exercises by exercise type (grammar, reading, listening, writing)' }),
    ApiResponse({ status: 200, description: 'Return all exercises of the specified type.', type: [ExerciseResponseDto] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('exerciseType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExerciseController.prototype, "findByType", null);
__decorate([
    Get('type/:exerciseType/lesson/:lessonId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get exercises by both exercise type and lesson ID' }),
    ApiResponse({ status: 200, description: 'Return exercises of the specified type for the given lesson.', type: [ExerciseResponseDto] }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Param('exerciseType')),
    __param(1, Param('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExerciseController.prototype, "findByTypeAndLessonId", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get exercise by id with all related data' }),
    ApiResponse({ status: 200, description: 'Return the exercise with all questions and related data.', type: ExerciseResponseDto }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Exercise not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExerciseController.prototype, "findOne", null);
__decorate([
    Get(':id/questions'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all questions for a specific exercise' }),
    ApiResponse({ status: 200, description: 'Return all questions for the specified exercise.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Exercise not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExerciseController.prototype, "getQuestionsForExercise", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update an exercise with related data' }),
    ApiResponse({ status: 200, description: 'Exercise has been updated successfully.', type: ExerciseResponseDto }),
    ApiResponse({ status: 400, description: 'Bad Request - Invalid exercise data.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Exercise not found.' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateExerciseDto]),
    __metadata("design:returntype", Promise)
], ExerciseController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Soft delete an exercise (set isActive to false)' }),
    ApiResponse({ status: 200, description: 'Exercise has been deleted successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    ApiResponse({ status: 404, description: 'Exercise not found.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExerciseController.prototype, "remove", null);
ExerciseController = __decorate([
    ApiTags('Exercises'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('exercise'),
    __metadata("design:paramtypes", [ExerciseService])
], ExerciseController);
export { ExerciseController };
//# sourceMappingURL=exercise.controller.js.map