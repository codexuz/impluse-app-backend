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
import { VocabularySetsService } from './vocabulary_sets.service.js';
import { CreateVocabularySetDto } from './dto/create-vocabulary_set.dto.js';
import { UpdateVocabularySetDto } from './dto/update-vocabulary_set.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
let VocabularySetsController = class VocabularySetsController {
    constructor(vocabularySetsService) {
        this.vocabularySetsService = vocabularySetsService;
    }
    create(createVocabularySetDto) {
        return this.vocabularySetsService.create(createVocabularySetDto);
    }
    findAll() {
        return this.vocabularySetsService.findAll();
    }
    findByCourse(courseId) {
        return this.vocabularySetsService.findByCourse(courseId);
    }
    findByLevel(level) {
        return this.vocabularySetsService.findByLevel(level);
    }
    findByTopic(topic) {
        return this.vocabularySetsService.findByTopic(topic);
    }
    findOne(id) {
        return this.vocabularySetsService.findOne(id);
    }
    update(id, updateVocabularySetDto) {
        return this.vocabularySetsService.update(id, updateVocabularySetDto);
    }
    remove(id) {
        return this.vocabularySetsService.remove(id);
    }
};
__decorate([
    Post(),
    UseGuards(RolesGuard),
    Roles('admin', 'teacher'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateVocabularySetDto]),
    __metadata("design:returntype", void 0)
], VocabularySetsController.prototype, "create", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VocabularySetsController.prototype, "findAll", null);
__decorate([
    Get('course/:courseId'),
    __param(0, Param('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VocabularySetsController.prototype, "findByCourse", null);
__decorate([
    Get('level/:level'),
    __param(0, Param('level')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VocabularySetsController.prototype, "findByLevel", null);
__decorate([
    Get('topic/:topic'),
    __param(0, Param('topic')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VocabularySetsController.prototype, "findByTopic", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VocabularySetsController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    UseGuards(RolesGuard),
    Roles('admin', 'teacher'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateVocabularySetDto]),
    __metadata("design:returntype", void 0)
], VocabularySetsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    UseGuards(RolesGuard),
    Roles('admin', 'teacher'),
    HttpCode(HttpStatus.NO_CONTENT),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VocabularySetsController.prototype, "remove", null);
VocabularySetsController = __decorate([
    Controller('vocabulary-sets'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [VocabularySetsService])
], VocabularySetsController);
export { VocabularySetsController };
//# sourceMappingURL=vocabulary_sets.controller.js.map