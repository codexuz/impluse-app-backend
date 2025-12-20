import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { VocabularyItem } from "./entities/vocabulary_item.entity.js";
import { CreateVocabularyItemDto } from "./dto/create-vocabulary_item.dto.js";
import { UpdateVocabularyItemDto } from "./dto/update-vocabulary_item.dto.js";
import { VocabularySet } from "../vocabulary_sets/entities/vocabulary_set.entity.js";
import { CreationAttributes } from "sequelize";

@Injectable()
export class VocabularyItemsService {
  constructor(
    @InjectModel(VocabularyItem)
    private vocabularyItemModel: typeof VocabularyItem
  ) {}

  async create(
    createVocabularyItemDto: CreateVocabularyItemDto
  ): Promise<VocabularyItem> {
    return this.vocabularyItemModel.create({ ...createVocabularyItemDto });
  }

  async createMany(
    createVocabularyItemDtos: CreateVocabularyItemDto[]
  ): Promise<VocabularyItem[]> {
    const items = createVocabularyItemDtos.map((dto) => ({
      set_id: dto.set_id,
      word: dto.word,
      uzbek: dto.uzbek,
      rus: dto.rus,
      example: dto.example,
    }));

    return this.vocabularyItemModel.bulkCreate(items);
  }

  async findAll(): Promise<VocabularyItem[]> {
    return this.vocabularyItemModel.findAll({
      include: [
        {
          model: VocabularySet,
          as: "vocabulary_set",
        },
      ],
    });
  }

  async findOne(id: string): Promise<VocabularyItem> {
    const vocabularyItem = await this.vocabularyItemModel.findByPk(id, {
      include: [
        {
          model: VocabularySet,
          as: "vocabulary_set",
        },
      ],
    });

    if (!vocabularyItem) {
      throw new NotFoundException(`Vocabulary item with ID "${id}" not found`);
    }
    return vocabularyItem;
  }

  async findBySetId(setId: string): Promise<VocabularyItem[]> {
    return this.vocabularyItemModel.findAll({
      where: { set_id: setId },
      include: [
        {
          model: VocabularySet,
          as: "vocabulary_set",
        },
      ],
    });
  }

  async findBySetIdPaginated(
    setId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: VocabularyItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;

    const { count, rows } = await this.vocabularyItemModel.findAndCountAll({
      where: { set_id: setId },
      include: [
        {
          model: VocabularySet,
          as: "vocabulary_set",
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findByWord(word: string): Promise<VocabularyItem[]> {
    return this.vocabularyItemModel.findAll({
      where: { word },
      include: [
        {
          model: VocabularySet,
          as: "vocabulary_set",
        },
      ],
    });
  }

  async update(
    id: string,
    updateVocabularyItemDto: UpdateVocabularyItemDto
  ): Promise<VocabularyItem> {
    const vocabularyItem = await this.findOne(id);
    await vocabularyItem.update(updateVocabularyItemDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const vocabularyItem = await this.findOne(id);
    await vocabularyItem.destroy();
  }

  async removeBySetId(setId: string): Promise<number> {
    return this.vocabularyItemModel.destroy({
      where: { set_id: setId },
    });
  }
}
