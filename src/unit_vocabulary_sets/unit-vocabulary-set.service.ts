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
      vocabulary_set_id: dto.vocabulary_set_id,
      title: dto.title
    })));
  }

  async findAll(): Promise<UnitVocabularySet[]> {
    return this.unitVocabularySetModel.findAll();
  }

  async findByVocabularySetId(vocabularySetId: string): Promise<UnitVocabularySet[]> {
    return this.unitVocabularySetModel.findAll({
      where: {
        vocabulary_set_id: vocabularySetId,
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

  async removeByVocabularySetId(vocabularySetId: string): Promise<number> {
    return this.unitVocabularySetModel.destroy({
      where: {
        vocabulary_set_id: vocabularySetId,
      },
    });
  }
}
