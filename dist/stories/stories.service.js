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
import { Story } from './entities/story.entity.js';
let StoriesService = class StoriesService {
    constructor(storyModel) {
        this.storyModel = storyModel;
    }
    async create(createStoryDto) {
        const story = await this.storyModel.create({
            ...createStoryDto,
            viewCount: 0,
            isPublished: createStoryDto.isPublished ?? false
        });
        return story;
    }
    async findAll() {
        return this.storyModel.findAll({
            where: { isPublished: true },
            order: [['createdAt', 'DESC']]
        });
    }
    async findAllAdmin() {
        return this.storyModel.findAll({
            order: [['createdAt', 'DESC']]
        });
    }
    async findOne(id) {
        const story = await this.storyModel.findOne({
            where: { id, isPublished: true }
        });
        if (!story) {
            throw new NotFoundException(`Story with ID ${id} not found or not published`);
        }
        return this.incrementViewCount(id);
    }
    async findOneAdmin(id) {
        const story = await this.storyModel.findByPk(id);
        if (!story) {
            throw new NotFoundException(`Story with ID ${id} not found`);
        }
        return story;
    }
    async update(id, updateStoryDto) {
        const story = await this.findOneAdmin(id);
        await story.update(updateStoryDto);
        return story;
    }
    async remove(id) {
        const story = await this.findOneAdmin(id);
        await story.destroy();
    }
    async publish(id) {
        const story = await this.findOneAdmin(id);
        await story.update({ isPublished: true });
        return story;
    }
    async unpublish(id) {
        const story = await this.findOneAdmin(id);
        await story.update({ isPublished: false });
        return story;
    }
    async incrementViewCount(id) {
        const story = await this.storyModel.findByPk(id);
        if (!story) {
            throw new NotFoundException(`Story with ID ${id} not found`);
        }
        await story.increment('viewCount');
        return story.reload();
    }
};
StoriesService = __decorate([
    Injectable(),
    __param(0, InjectModel(Story)),
    __metadata("design:paramtypes", [Object])
], StoriesService);
export { StoriesService };
//# sourceMappingURL=stories.service.js.map