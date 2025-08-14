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
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Writing } from './entities/writing.entity.js';
let WritingService = class WritingService {
    constructor(writingModel) {
        this.writingModel = writingModel;
    }
    async create(createWritingDto) {
        return await this.writingModel.create({
            ...createWritingDto
        });
    }
    async findAll() {
        return await this.writingModel.findAll();
    }
    async findOne(id) {
        const writing = await this.writingModel.findByPk(id);
        if (!writing) {
            throw new NotFoundException(`Writing with ID ${id} not found`);
        }
        return writing;
    }
    async update(id, updateWritingDto) {
        const writing = await this.findOne(id);
        await writing.update(updateWritingDto);
        return writing;
    }
    async remove(id) {
        const writing = await this.findOne(id);
        await writing.destroy();
        return { id, deleted: true };
    }
    async findByLessonId(lessonId) {
        return await this.writingModel.findAll({
            where: {
                lessonId,
            },
        });
    }
};
WritingService = __decorate([
    Injectable(),
    __param(0, InjectModel(Writing)),
    __metadata("design:paramtypes", [Object])
], WritingService);
export { WritingService };
//# sourceMappingURL=writing.service.js.map