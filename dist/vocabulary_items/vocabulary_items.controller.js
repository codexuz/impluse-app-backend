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
import { VocabularyItemsService } from './vocabulary_items.service.js';
import { CreateVocabularyItemDto } from './dto/create-vocabulary_item.dto.js';
import { UpdateVocabularyItemDto } from './dto/update-vocabulary_item.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
let VocabularyItemsController = class VocabularyItemsController {
    constructor(vocabularyItemsService) {
        this.vocabularyItemsService = vocabularyItemsService;
    }
    create(createVocabularyItemDto) {
        return this.vocabularyItemsService.create(createVocabularyItemDto);
    }
    createMany(createVocabularyItemDtos) {
        return this.vocabularyItemsService.createMany(createVocabularyItemDtos);
    }
    findAll() {
        return this.vocabularyItemsService.findAll();
    }
    findBySetId(setId) {
        return this.vocabularyItemsService.findBySetId(setId);
    }
    findByWord(word) {
        return this.vocabularyItemsService.findByWord(word);
    }
    findOne(id) {
        return this.vocabularyItemsService.findOne(id);
    }
    update(id, updateVocabularyItemDto) {
        return this.vocabularyItemsService.update(id, updateVocabularyItemDto);
    }
    remove(id) {
        return this.vocabularyItemsService.remove(id);
    }
    removeBySetId(setId) {
        return this.vocabularyItemsService.removeBySetId(setId);
    }
};
__decorate([
    Post(),
    UseGuards(RolesGuard),
    Roles('admin', 'teacher'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateVocabularyItemDto]),
    __metadata("design:returntype", void 0)
], VocabularyItemsController.prototype, "create", null);
__decorate([
    Post('bulk'),
    UseGuards(RolesGuard),
    Roles('admin', 'teacher'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], VocabularyItemsController.prototype, "createMany", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VocabularyItemsController.prototype, "findAll", null);
__decorate([
    Get('set/:setId'),
    __param(0, Param('setId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VocabularyItemsController.prototype, "findBySetId", null);
__decorate([
    Get('word/:word'),
    __param(0, Param('word')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VocabularyItemsController.prototype, "findByWord", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VocabularyItemsController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    UseGuards(RolesGuard),
    Roles('admin', 'teacher'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateVocabularyItemDto]),
    __metadata("design:returntype", void 0)
], VocabularyItemsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    UseGuards(RolesGuard),
    Roles('admin', 'teacher'),
    HttpCode(HttpStatus.NO_CONTENT),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VocabularyItemsController.prototype, "remove", null);
__decorate([
    Delete('set/:setId'),
    UseGuards(RolesGuard),
    Roles('admin', 'teacher'),
    HttpCode(HttpStatus.NO_CONTENT),
    __param(0, Param('setId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VocabularyItemsController.prototype, "removeBySetId", null);
VocabularyItemsController = __decorate([
    Controller('vocabulary-items'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [VocabularyItemsService])
], VocabularyItemsController);
export { VocabularyItemsController };
//# sourceMappingURL=vocabulary_items.controller.js.map