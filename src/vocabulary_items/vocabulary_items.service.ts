import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { VocabularyItem } from "./entities/vocabulary_item.entity.js";
import { CreateVocabularyItemDto } from "./dto/create-vocabulary_item.dto.js";
import { UpdateVocabularyItemDto } from "./dto/update-vocabulary_item.dto.js";
import {
  QueryVocabularyItemDto,
  SortOrder,
  MediaFilter,
  VocabularyItemStats,
  PaginatedVocabularyItemsResponse,
} from "./dto/query-vocabulary_item.dto.js";
import { VocabularySet } from "../vocabulary_sets/entities/vocabulary_set.entity.js";
import { CreationAttributes, Op, WhereOptions, literal } from "sequelize";

@Injectable()
export class VocabularyItemsService {
  constructor(
    @InjectModel(VocabularyItem)
    private vocabularyItemModel: typeof VocabularyItem,
  ) {}

  async create(
    createVocabularyItemDto: CreateVocabularyItemDto,
  ): Promise<VocabularyItem> {
    return this.vocabularyItemModel.create({ ...createVocabularyItemDto });
  }

  async createMany(
    createVocabularyItemDtos: CreateVocabularyItemDto[],
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

  async findAllPaginated(
    query: QueryVocabularyItemDto,
  ): Promise<PaginatedVocabularyItemsResponse> {
    const page = query.page ? parseInt(query.page, 10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 10;
    const offset = (page - 1) * limit;

    const whereClause: WhereOptions = {};

    // Search filter
    if (query.search) {
      whereClause[Op.or as any] = [
        { word: { [Op.like]: `%${query.search}%` } },
        { uzbek: { [Op.like]: `%${query.search}%` } },
        { rus: { [Op.like]: `%${query.search}%` } },
      ];
    }

    // Image filter
    if (query.imageFilter === MediaFilter.WITH_IMAGES) {
      whereClause.image_url = {
        [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: "" }],
      };
    } else if (query.imageFilter === MediaFilter.WITHOUT_IMAGES) {
      whereClause.image_url = { [Op.or]: [{ [Op.is]: null }, { [Op.eq]: "" }] };
    }

    // Audio filter
    if (query.audioFilter === MediaFilter.WITH_AUDIOS) {
      whereClause.audio_url = {
        [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: "" }],
      };
    } else if (query.audioFilter === MediaFilter.WITHOUT_AUDIOS) {
      whereClause.audio_url = { [Op.or]: [{ [Op.is]: null }, { [Op.eq]: "" }] };
    }

    // Example filter
    if (query.exampleFilter === MediaFilter.WITH_EXAMPLES) {
      whereClause.example = { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: "" }] };
    } else if (query.exampleFilter === MediaFilter.WITHOUT_EXAMPLES) {
      whereClause.example = { [Op.or]: [{ [Op.is]: null }, { [Op.eq]: "" }] };
    }

    // Sort order
    const order: [string, string][] =
      query.sort === SortOrder.OLDEST
        ? [["createdAt", "ASC"]]
        : [["createdAt", "DESC"]];

    const { count, rows } = await this.vocabularyItemModel.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: VocabularySet,
          as: "vocabulary_set",
        },
      ],
      limit,
      offset,
      order,
    });

    // Get stats
    const stats = await this.getStats();

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      stats,
    };
  }

  async getStats(setId?: string): Promise<VocabularyItemStats> {
    const whereClause: WhereOptions = setId ? { set_id: setId } : {};

    const totalWords = await this.vocabularyItemModel.count({
      where: whereClause,
    });

    const withImages = await this.vocabularyItemModel.count({
      where: {
        ...whereClause,
        image_url: { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: "" }] },
      },
    });

    const withAudios = await this.vocabularyItemModel.count({
      where: {
        ...whereClause,
        audio_url: { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: "" }] },
      },
    });

    const withExamples = await this.vocabularyItemModel.count({
      where: {
        ...whereClause,
        example: { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: "" }] },
      },
    });

    return {
      totalWords,
      withImages,
      withoutImages: totalWords - withImages,
      withAudios,
      withoutAudios: totalWords - withAudios,
      withExamples,
      withoutExamples: totalWords - withExamples,
    };
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
    query: QueryVocabularyItemDto,
  ): Promise<PaginatedVocabularyItemsResponse> {
    const page = query.page ? parseInt(query.page, 10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 10;
    const offset = (page - 1) * limit;

    const whereClause: WhereOptions = { set_id: setId };

    // Search filter
    if (query.search) {
      whereClause[Op.or as any] = [
        { word: { [Op.like]: `%${query.search}%` } },
        { uzbek: { [Op.like]: `%${query.search}%` } },
        { rus: { [Op.like]: `%${query.search}%` } },
      ];
    }

    // Image filter
    if (query.imageFilter === MediaFilter.WITH_IMAGES) {
      whereClause.image_url = {
        [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: "" }],
      };
    } else if (query.imageFilter === MediaFilter.WITHOUT_IMAGES) {
      whereClause.image_url = { [Op.or]: [{ [Op.is]: null }, { [Op.eq]: "" }] };
    }

    // Audio filter
    if (query.audioFilter === MediaFilter.WITH_AUDIOS) {
      whereClause.audio_url = {
        [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: "" }],
      };
    } else if (query.audioFilter === MediaFilter.WITHOUT_AUDIOS) {
      whereClause.audio_url = { [Op.or]: [{ [Op.is]: null }, { [Op.eq]: "" }] };
    }

    // Example filter
    if (query.exampleFilter === MediaFilter.WITH_EXAMPLES) {
      whereClause.example = { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: "" }] };
    } else if (query.exampleFilter === MediaFilter.WITHOUT_EXAMPLES) {
      whereClause.example = { [Op.or]: [{ [Op.is]: null }, { [Op.eq]: "" }] };
    }

    // Sort order
    const order: [string, string][] =
      query.sort === SortOrder.OLDEST
        ? [["createdAt", "ASC"]]
        : [["createdAt", "DESC"]];

    const { count, rows } = await this.vocabularyItemModel.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: VocabularySet,
          as: "vocabulary_set",
        },
      ],
      limit,
      offset,
      order,
    });

    // Get stats for this set
    const stats = await this.getStats(setId);

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      stats,
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
    updateVocabularyItemDto: UpdateVocabularyItemDto,
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
