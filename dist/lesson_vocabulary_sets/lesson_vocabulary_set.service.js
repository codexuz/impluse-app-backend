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
import { LessonVocabularySet } from './entities/lesson_vocabulary_set.entity.js';
let LessonVocabularySetService = class LessonVocabularySetService {
    constructor(lessonVocabularySetModel) {
        this.lessonVocabularySetModel = lessonVocabularySetModel;
    }
    async create(createLessonVocabularySetDto) {
        return await this.lessonVocabularySetModel.create({
            ...createLessonVocabularySetDto
        });
    }
    async createMany(createDtos) {
        return await this.lessonVocabularySetModel.bulkCreate(createDtos);
    }
    async findAll() {
        return await this.lessonVocabularySetModel.findAll();
    }
    async findOne(id) {
        const vocabularySet = await this.lessonVocabularySetModel.findByPk(id);
        if (!vocabularySet) {
            throw new NotFoundException(`Lesson vocabulary set with ID ${id} not found`);
        }
        return vocabularySet;
    }
    async findByLessonId(lesson_id) {
        return await this.lessonVocabularySetModel.findAll({
            where: { lesson_id }
        });
    }
    async findByVocabularyItemId(vocabulary_item_id) {
        return await this.lessonVocabularySetModel.findAll({
            where: { vocabulary_item_id }
        });
    }
    async update(id, updateLessonVocabularySetDto) {
        const [affectedCount, [updatedSet]] = await this.lessonVocabularySetModel.update(updateLessonVocabularySetDto, {
            where: { id },
            returning: true
        });
        if (affectedCount === 0) {
            throw new NotFoundException(`Lesson vocabulary set with ID ${id} not found`);
        }
        return updatedSet;
    }
    async remove(id) {
        const deleted = await this.lessonVocabularySetModel.destroy({
            where: { id }
        });
        if (deleted === 0) {
            throw new NotFoundException(`Lesson vocabulary set with ID ${id} not found`);
        }
    }
    async removeByLessonId(lesson_id) {
        return await this.lessonVocabularySetModel.destroy({
            where: { lesson_id }
        });
    }
};
LessonVocabularySetService = __decorate([
    Injectable(),
    __param(0, InjectModel(LessonVocabularySet)),
    __metadata("design:paramtypes", [Object])
], LessonVocabularySetService);
export { LessonVocabularySetService };
//# sourceMappingURL=lesson_vocabulary_set.service.js.map