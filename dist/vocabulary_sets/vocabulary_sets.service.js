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
import { VocabularySet } from './entities/vocabulary_set.entity.js';
let VocabularySetsService = class VocabularySetsService {
    constructor(vocabularySetModel) {
        this.vocabularySetModel = vocabularySetModel;
    }
    async create(createVocabularySetDto) {
        return this.vocabularySetModel.create({ ...createVocabularySetDto });
    }
    async findAll() {
        return this.vocabularySetModel.findAll();
    }
    async findOne(id) {
        const vocabularySet = await this.vocabularySetModel.findByPk(id);
        if (!vocabularySet) {
            throw new NotFoundException(`Vocabulary set with ID "${id}" not found`);
        }
        return vocabularySet;
    }
    async findByCourse(courseId) {
        return this.vocabularySetModel.findAll({
            where: { course_id: courseId }
        });
    }
    async findByLevel(level) {
        return this.vocabularySetModel.findAll({
            where: { level }
        });
    }
    async findByTopic(topic) {
        return this.vocabularySetModel.findAll({
            where: { topic }
        });
    }
    async update(id, updateVocabularySetDto) {
        const vocabularySet = await this.findOne(id);
        await vocabularySet.update(updateVocabularySetDto);
        return vocabularySet;
    }
    async remove(id) {
        const vocabularySet = await this.findOne(id);
        await vocabularySet.destroy();
    }
};
VocabularySetsService = __decorate([
    Injectable(),
    __param(0, InjectModel(VocabularySet)),
    __metadata("design:paramtypes", [Object])
], VocabularySetsService);
export { VocabularySetsService };
//# sourceMappingURL=vocabulary_sets.service.js.map