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
import { LessonContent } from './entities/lesson-content.entity.js';
let LessonContentService = class LessonContentService {
    constructor(lessonContentModel) {
        this.lessonContentModel = lessonContentModel;
    }
    async create(createLessonContentDto) {
        return await this.lessonContentModel.create({ ...createLessonContentDto });
    }
    async findAll() {
        return await this.lessonContentModel.findAll({
            where: { isActive: true },
            order: [['order_number', 'ASC']]
        });
    }
    async findOne(id) {
        const content = await this.lessonContentModel.findByPk(id);
        if (!content) {
            throw new NotFoundException(`Lesson content with ID ${id} not found`);
        }
        return content;
    }
    async findByLessonId(lessonId) {
        const contents = await this.lessonContentModel.findAll({
            where: {
                lessonId,
                isActive: true
            },
            order: [['order_number', 'ASC']]
        });
        if (!contents.length) {
            throw new NotFoundException(`No content found for lesson ID ${lessonId}`);
        }
        return contents;
    }
    async update(id, updateLessonContentDto) {
        const content = await this.findOne(id);
        return await content.update(updateLessonContentDto);
    }
    async remove(id) {
        const content = await this.findOne(id);
        await content.update({ isActive: false });
        return { id };
    }
};
LessonContentService = __decorate([
    Injectable(),
    __param(0, InjectModel(LessonContent)),
    __metadata("design:paramtypes", [Object])
], LessonContentService);
export { LessonContentService };
//# sourceMappingURL=lesson-content.service.js.map