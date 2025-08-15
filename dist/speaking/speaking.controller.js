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
    findOne(id) {
        return this.speakingService.findOne(id);
    }
    update(id, updateSpeakingDto) {
        return this.speakingService.update(id, updateSpeakingDto);
    }
    remove(id) {
        return this.speakingService.remove(id);
    }
};
__decorate([
    Post(),
    Roles('admin', 'teacher'),
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
    Get(':id'),
    ApiOperation({ summary: 'Get speaking exercise by id' }),
    ApiResponse({ status: 200, description: 'Return speaking exercise.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpeakingController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    Roles('admin', 'teacher'),
    ApiOperation({ summary: 'Update speaking exercise' }),
    ApiResponse({ status: 200, description: 'Successfully updated.' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateSpeakingDto]),
    __metadata("design:returntype", void 0)
], SpeakingController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles('admin'),
    ApiOperation({ summary: 'Delete speaking exercise' }),
    ApiResponse({ status: 200, description: 'Successfully deleted.' }),
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