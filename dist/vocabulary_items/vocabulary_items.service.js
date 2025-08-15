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
import { VocabularyItem } from './entities/vocabulary_item.entity.js';
import { VocabularySet } from '../vocabulary_sets/entities/vocabulary_set.entity.js';
let VocabularyItemsService = class VocabularyItemsService {
    constructor(vocabularyItemModel) {
        this.vocabularyItemModel = vocabularyItemModel;
    }
    async create(createVocabularyItemDto) {
        return this.vocabularyItemModel.create({ ...createVocabularyItemDto });
    }
    async createMany(createVocabularyItemDtos) {
        const items = createVocabularyItemDtos.map(dto => ({
            set_id: dto.set_id,
            word: dto.word,
            uzbek: dto.uzbek,
            rus: dto.rus,
            example: dto.example
        }));
        return this.vocabularyItemModel.bulkCreate(items);
    }
    async findAll() {
        return this.vocabularyItemModel.findAll({
            include: [{
                    model: VocabularySet,
                    as: 'vocabulary_set'
                }]
        });
    }
    async findOne(id) {
        const vocabularyItem = await this.vocabularyItemModel.findByPk(id, {
            include: [{
                    model: VocabularySet,
                    as: 'vocabulary_set'
                }]
        });
        if (!vocabularyItem) {
            throw new NotFoundException(`Vocabulary item with ID "${id}" not found`);
        }
        return vocabularyItem;
    }
    async findBySetId(setId) {
        return this.vocabularyItemModel.findAll({
            where: { set_id: setId },
            include: [{
                    model: VocabularySet,
                    as: 'vocabulary_set'
                }]
        });
    }
    async findByWord(word) {
        return this.vocabularyItemModel.findAll({
            where: { word },
            include: [{
                    model: VocabularySet,
                    as: 'vocabulary_set'
                }]
        });
    }
    async update(id, updateVocabularyItemDto) {
        const vocabularyItem = await this.findOne(id);
        await vocabularyItem.update(updateVocabularyItemDto);
        return this.findOne(id);
    }
    async remove(id) {
        const vocabularyItem = await this.findOne(id);
        await vocabularyItem.destroy();
    }
    async removeBySetId(setId) {
        return this.vocabularyItemModel.destroy({
            where: { set_id: setId }
        });
    }
};
VocabularyItemsService = __decorate([
    Injectable(),
    __param(0, InjectModel(VocabularyItem)),
    __metadata("design:paramtypes", [Object])
], VocabularyItemsService);
export { VocabularyItemsService };
//# sourceMappingURL=vocabulary_items.service.js.map