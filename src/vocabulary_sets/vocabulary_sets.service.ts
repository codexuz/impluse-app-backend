import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VocabularySet } from './entities/vocabulary_set.entity.js';
import { CreateVocabularySetDto } from './dto/create-vocabulary_set.dto.js';
import { UpdateVocabularySetDto } from './dto/update-vocabulary_set.dto.js';

@Injectable()
export class VocabularySetsService {
  constructor(
    @InjectModel(VocabularySet)
    private vocabularySetModel: typeof VocabularySet,
  ) {}

  async create(createVocabularySetDto: CreateVocabularySetDto): Promise<VocabularySet> {
    return this.vocabularySetModel.create({ ...createVocabularySetDto });
  }

  async findAll(): Promise<VocabularySet[]> {
    return this.vocabularySetModel.findAll();
  }

  async findOne(id: string): Promise<VocabularySet> {
    const vocabularySet = await this.vocabularySetModel.findByPk(id);
    if (!vocabularySet) {
      throw new NotFoundException(`Vocabulary set with ID "${id}" not found`);
    }
    return vocabularySet;
  }

  async findByCourse(courseId: string): Promise<VocabularySet[]> {
    return this.vocabularySetModel.findAll({
      where: { course_id: courseId }
    });
  }

  async findByLevel(level: string): Promise<VocabularySet[]> {
    return this.vocabularySetModel.findAll({
      where: { level }
    });
  }

  async findByTopic(topic: string): Promise<VocabularySet[]> {
    return this.vocabularySetModel.findAll({
      where: { topic }
    });
  }

  async update(id: string, updateVocabularySetDto: UpdateVocabularySetDto): Promise<VocabularySet> {
    const vocabularySet = await this.findOne(id);
    await vocabularySet.update(updateVocabularySetDto);
    return vocabularySet;
  }

  async remove(id: string): Promise<void> {
    const vocabularySet = await this.findOne(id);
    await vocabularySet.destroy();
  }
}
