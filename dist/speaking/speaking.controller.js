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
import { SpeakingService } from './speaking.service.js';
import { CreateSpeakingDto } from './dto/create-speaking.dto.js';
import { UpdateSpeakingDto } from './dto/update-speaking.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
let SpeakingController = class SpeakingController {
    constructor(speakingService) {
        this.speakingService = speakingService;
    }
    create(createSpeakingDto) {
        return this.speakingService.create(createSpeakingDto);
    }
    findAll() {
        return this.speakingService.findAll();
    }
    findByLesson(lessonId) {
        return this.speakingService.findByLesson(lessonId);
    }
    getByType(type) {
        return this.speakingService.getByType(type);
    }
    findByLessonAndType(lessonId, type) {
        return this.speakingService.findByLessonAndType(lessonId, type);
    }
    findOne(id) {
        return this.speakingService.findOne(id);
    }
    update(id, updateSpeakingDto) {
        return this.speakingService.update(id, updateSpeakingDto);
    }
    countRelated(id) {
        return this.speakingService.countRelatedEntities(id);
    }
    removeRelated(id) {
        return this.speakingService.deleteRelatedEntities(id);
    }
    remove(id) {
        return this.speakingService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create speaking exercise' }),
    ApiResponse({ status: 201, description: 'Successfully created.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSpeakingDto]),
    __metadata("design:returntype", void 0)
], SpeakingController.prototype, "create", null);
__decorate([
    Get(),
    ApiOperation({ summary: 'Get all speaking exercises' }),
    ApiResponse({ status: 200, description: 'Return all speaking exercises.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SpeakingController.prototype, "findAll", null);
__decorate([
    Get('lesson/:lessonId'),
    ApiOperation({ summary: 'Get speaking exercises by lesson ID' }),
    ApiResponse({ status: 200, description: 'Return all speaking exercises for the lesson with related pronunciation exercises and IELTS questions parts 1, 2, and 3.' }),
    __param(0, Param('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpeakingController.prototype, "findByLesson", null);
__decorate([
    Get('type/:type'),
    ApiOperation({ summary: 'Get speaking exercises by type (speaking or pronunciation)' }),
    ApiResponse({ status: 200, description: 'Return all speaking exercises of the specified type with related pronunciation exercises and IELTS questions.' }),
    __param(0, Param('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpeakingController.prototype, "getByType", null);
__decorate([
    Get('lesson/:lessonId/type/:type'),
    ApiOperation({ summary: 'Get speaking exercises by both lesson ID and type' }),
    ApiResponse({ status: 200, description: 'Return all speaking exercises for the specific lesson and type with related entities.' }),
    __param(0, Param('lessonId')),
    __param(1, Param('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SpeakingController.prototype, "findByLessonAndType", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Get speaking exercise by id' }),
    ApiResponse({ status: 200, description: 'Return speaking exercise with related pronunciation exercises and IELTS questions parts 1, 2, and 3.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpeakingController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update speaking exercise' }),
    ApiResponse({ status: 200, description: 'Successfully updated.' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateSpeakingDto]),
    __metadata("design:returntype", void 0)
], SpeakingController.prototype, "update", null);
__decorate([
    Get(':id/related/count'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Count all related entities (pronunciation exercises and IELTS questions)' }),
    ApiResponse({ status: 200, description: 'Return count of all related entities.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpeakingController.prototype, "countRelated", null);
__decorate([
    Delete(':id/related'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Delete all related entities (pronunciation exercises and IELTS questions) without deleting the speaking exercise' }),
    ApiResponse({ status: 200, description: 'Successfully deleted related entities.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpeakingController.prototype, "removeRelated", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Delete speaking exercise and all its related entities' }),
    ApiResponse({ status: 200, description: 'Successfully deleted speaking exercise and related entities.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpeakingController.prototype, "remove", null);
SpeakingController = __decorate([
    ApiTags('speaking'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
    Controller('speaking'),
    __metadata("design:paramtypes", [SpeakingService])
], SpeakingController);
export { SpeakingController };
//# sourceMappingURL=speaking.controller.js.map