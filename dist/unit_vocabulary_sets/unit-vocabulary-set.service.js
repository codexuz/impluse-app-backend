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
import { UnitVocabularySet } from './entities/unit_vocabulary_set.entity.js';
let UnitVocabularySetService = class UnitVocabularySetService {
    constructor(unitVocabularySetModel) {
        this.unitVocabularySetModel = unitVocabularySetModel;
    }
    async create(createUnitVocabularySetDto) {
        return this.unitVocabularySetModel.create({
            ...createUnitVocabularySetDto,
        });
    }
    async createMany(createDtos) {
        return this.unitVocabularySetModel.bulkCreate(createDtos.map(dto => ({
            unit_id: dto.unit_id,
            vocabulary_item_id: dto.vocabulary_item_id
        })));
    }
    async findAll() {
        return this.unitVocabularySetModel.findAll();
    }
    async findByUnitId(unitId) {
        return this.unitVocabularySetModel.findAll({
            where: {
                unit_id: unitId,
            },
        });
    }
    async findOne(id) {
        const vocabularySet = await this.unitVocabularySetModel.findByPk(id);
        if (!vocabularySet) {
            throw new NotFoundException(`Unit vocabulary set with ID "${id}" not found`);
        }
        return vocabularySet;
    }
    async remove(id) {
        const vocabularySet = await this.findOne(id);
        await vocabularySet.destroy();
    }
    async removeByUnitId(unitId) {
        return this.unitVocabularySetModel.destroy({
            where: {
                unit_id: unitId,
            },
        });
    }
    async removeByVocabularyItemId(vocabularyItemId) {
        return this.unitVocabularySetModel.destroy({
            where: {
                vocabulary_item_id: vocabularyItemId,
            },
        });
    }
};
UnitVocabularySetService = __decorate([
    Injectable(),
    __param(0, InjectModel(UnitVocabularySet)),
    __metadata("design:paramtypes", [Object])
], UnitVocabularySetService);
export { UnitVocabularySetService };
//# sourceMappingURL=unit-vocabulary-set.service.js.map