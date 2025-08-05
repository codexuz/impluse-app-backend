import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUnitVocabularySetDto } from './dto/create-unit_vocabulary_set.dto.js';
import { UnitVocabularySet } from './entities/unit_vocabulary_set.entity.js';

@Injectable()
export class UnitVocabularySetService {
  constructor(
    @InjectModel(UnitVocabularySet)
    private unitVocabularySetModel: typeof UnitVocabularySet,
  ) {}

  async create(createUnitVocabularySetDto: CreateUnitVocabularySetDto): Promise<UnitVocabularySet> {
    return this.unitVocabularySetModel.create({
      ...createUnitVocabularySetDto,
    });
  }

  async createMany(createDtos: CreateUnitVocabularySetDto[]): Promise<UnitVocabularySet[]> {
    return this.unitVocabularySetModel.bulkCreate(createDtos.map(dto => ({
      unit_id: dto.unit_id,
      vocabulary_item_id: dto.vocabulary_item_id
    })));
  }

  async findAll(): Promise<UnitVocabularySet[]> {
    return this.unitVocabularySetModel.findAll();
  }

  async findByUnitId(unitId: string): Promise<UnitVocabularySet[]> {
    return this.unitVocabularySetModel.findAll({
      where: {
        unit_id: unitId,
      },
    });
  }

  async findOne(id: string): Promise<UnitVocabularySet> {
    const vocabularySet = await this.unitVocabularySetModel.findByPk(id);
    if (!vocabularySet) {
      throw new NotFoundException(`Unit vocabulary set with ID "${id}" not found`);
    }
    return vocabularySet;
  }

  async remove(id: string): Promise<void> {
    const vocabularySet = await this.findOne(id);
    await vocabularySet.destroy();
  }

  async removeByUnitId(unitId: string): Promise<number> {
    return this.unitVocabularySetModel.destroy({
      where: {
        unit_id: unitId,
      },
    });
  }

  async removeByVocabularyItemId(vocabularyItemId: string): Promise<number> {
    return this.unitVocabularySetModel.destroy({
      where: {
        vocabulary_item_id: vocabularyItemId,
      },
    });
  }
}
