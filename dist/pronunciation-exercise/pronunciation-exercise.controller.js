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
import { PronunciationExerciseService } from './pronunciation-exercise.service.js';
import { CreatePronunciationExerciseDto } from './dto/create-pronunciation-exercise.dto.js';
import { UpdatePronunciationExerciseDto } from './dto/update-pronunciation-exercise.dto.js';
import { PronunciationExercise } from './entities/pronunciation-exercise.entity.js';
let PronunciationExerciseController = class PronunciationExerciseController {
    constructor(pronunciationExerciseService) {
        this.pronunciationExerciseService = pronunciationExerciseService;
    }
    create(createPronunciationExerciseDto) {
        return this.pronunciationExerciseService.create(createPronunciationExerciseDto);
    }
    findAll() {
        return this.pronunciationExerciseService.findAll();
    }
    findOne(id) {
        return this.pronunciationExerciseService.findOne(id);
    }
    findBySpeakingId(speaking_id) {
        return this.pronunciationExerciseService.findBySpeakingId(speaking_id);
    }
    update(id, updatePronunciationExerciseDto) {
        return this.pronunciationExerciseService.update(id, updatePronunciationExerciseDto);
    }
    remove(id) {
        return this.pronunciationExerciseService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new pronunciation exercise' }),
    ApiResponse({
        status: 201,
        description: 'The pronunciation exercise has been successfully created.',
        type: PronunciationExercise
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePronunciationExerciseDto]),
    __metadata("design:returntype", void 0)
], PronunciationExerciseController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all pronunciation exercises' }),
    ApiResponse({
        status: 200,
        description: 'Returns all pronunciation exercises',
        type: [PronunciationExercise]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PronunciationExerciseController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get a specific pronunciation exercise by ID' }),
    ApiResponse({
        status: 200,
        description: 'Returns the pronunciation exercise',
        type: PronunciationExercise
    }),
    ApiResponse({ status: 404, description: 'Exercise not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PronunciationExerciseController.prototype, "findOne", null);
__decorate([
    Get('speaking/:speaking_id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all pronunciation exercises for a speaking exercise' }),
    ApiResponse({
        status: 200,
        description: 'Returns all pronunciation exercises for the specified speaking exercise',
        type: [PronunciationExercise]
    }),
    __param(0, Param('speaking_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PronunciationExerciseController.prototype, "findBySpeakingId", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update a pronunciation exercise' }),
    ApiResponse({
        status: 200,
        description: 'The pronunciation exercise has been successfully updated.',
        type: PronunciationExercise
    }),
    ApiResponse({ status: 404, description: 'Exercise not found' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdatePronunciationExerciseDto]),
    __metadata("design:returntype", void 0)
], PronunciationExerciseController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Delete a pronunciation exercise' }),
    ApiResponse({ status: 200, description: 'The pronunciation exercise has been successfully deleted.' }),
    ApiResponse({ status: 404, description: 'Exercise not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PronunciationExerciseController.prototype, "remove", null);
PronunciationExerciseController = __decorate([
    ApiTags('pronunciation-exercise'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('pronunciation-exercise'),
    __metadata("design:paramtypes", [PronunciationExerciseService])
], PronunciationExerciseController);
export { PronunciationExerciseController };
//# sourceMappingURL=pronunciation-exercise.controller.js.map