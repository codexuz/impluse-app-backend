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
import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UnitVocabularySetService } from './unit-vocabulary-set.service.js';
import { CreateUnitVocabularySetDto } from './dto/create-unit_vocabulary_set.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
let UnitVocabularySetController = class UnitVocabularySetController {
    constructor(unitVocabularySetService) {
        this.unitVocabularySetService = unitVocabularySetService;
    }
    async create(createUnitVocabularySetDto) {
        return await this.unitVocabularySetService.create(createUnitVocabularySetDto);
    }
    async createMany(createDtos) {
        return await this.unitVocabularySetService.createMany(createDtos);
    }
    async findAll() {
        return await this.unitVocabularySetService.findAll();
    }
    async findByUnitId(unitId) {
        return await this.unitVocabularySetService.findByUnitId(unitId);
    }
    async findOne(id) {
        return await this.unitVocabularySetService.findOne(id);
    }
    async remove(id) {
        return await this.unitVocabularySetService.remove(id);
    }
    async removeByUnitId(unitId) {
        return await this.unitVocabularySetService.removeByUnitId(unitId);
    }
    async removeByVocabularyItemId(vocabularyItemId) {
        return await this.unitVocabularySetService.removeByVocabularyItemId(vocabularyItemId);
    }
};
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    Roles('admin', 'teacher'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUnitVocabularySetDto]),
    __metadata("design:returntype", Promise)
], UnitVocabularySetController.prototype, "create", null);
__decorate([
    Post('bulk'),
    HttpCode(HttpStatus.CREATED),
    Roles('admin', 'teacher'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UnitVocabularySetController.prototype, "createMany", null);
__decorate([
    Get(),
    Roles('admin', 'teacher'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UnitVocabularySetController.prototype, "findAll", null);
__decorate([
    Get('unit/:unitId'),
    Roles('admin', 'teacher', 'student'),
    __param(0, Param('unitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnitVocabularySetController.prototype, "findByUnitId", null);
__decorate([
    Get(':id'),
    Roles('admin', 'teacher', 'student'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnitVocabularySetController.prototype, "findOne", null);
__decorate([
    Delete(':id'),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles('admin', 'teacher'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnitVocabularySetController.prototype, "remove", null);
__decorate([
    Delete('unit/:unitId'),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles('admin', 'teacher'),
    __param(0, Param('unitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnitVocabularySetController.prototype, "removeByUnitId", null);
__decorate([
    Delete('vocabulary/:vocabularyItemId'),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles('admin', 'teacher'),
    __param(0, Param('vocabularyItemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnitVocabularySetController.prototype, "removeByVocabularyItemId", null);
UnitVocabularySetController = __decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('unit-vocabulary-sets'),
    __metadata("design:paramtypes", [UnitVocabularySetService])
], UnitVocabularySetController);
export { UnitVocabularySetController };
//# sourceMappingURL=unit-vocabulary-set.controller.js.map