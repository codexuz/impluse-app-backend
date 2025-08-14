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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { WritingService } from './writing.service.js';
import { CreateWritingDto } from './dto/create-writing.dto.js';
import { UpdateWritingDto } from './dto/update-writing.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
let WritingController = class WritingController {
    constructor(writingService) {
        this.writingService = writingService;
    }
    async create(createWritingDto) {
        return await this.writingService.create(createWritingDto);
    }
    async findAll() {
        return await this.writingService.findAll();
    }
    async findByLessonId(lessonId) {
        return await this.writingService.findByLessonId(lessonId);
    }
    async findOne(id) {
        return await this.writingService.findOne(id);
    }
    async update(id, updateWritingDto) {
        return await this.writingService.update(id, updateWritingDto);
    }
    async remove(id) {
        return await this.writingService.remove(id);
    }
};
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new writing exercise' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateWritingDto]),
    __metadata("design:returntype", Promise)
], WritingController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all writing exercises' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WritingController.prototype, "findAll", null);
__decorate([
    Get('lesson/:lessonId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get writing exercises by lesson id' }),
    __param(0, Param('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WritingController.prototype, "findByLessonId", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get writing exercise by id' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WritingController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update writing exercise' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateWritingDto]),
    __metadata("design:returntype", Promise)
], WritingController.prototype, "update", null);
__decorate([
    Delete(':id'),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete writing exercise' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WritingController.prototype, "remove", null);
WritingController = __decorate([
    ApiTags('Writing'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('writing'),
    __metadata("design:paramtypes", [WritingService])
], WritingController);
export { WritingController };
//# sourceMappingURL=writing.controller.js.map