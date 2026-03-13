import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
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
import { UnitVocabularySet } from "../unit_vocabulary_sets/entities/unit_vocabulary_set.entity.js";
import { CreationAttributes, Op, WhereOptions, literal } from "sequelize";
import ExcelJS from "exceljs";
import { StudentVocabularyProgressService } from "../student_vocabulary_progress/student-vocabulary-progress.service.js";

@Injectable()
export class VocabularyItemsService {
  constructor(
    @InjectModel(VocabularyItem)
    private vocabularyItemModel: typeof VocabularyItem,
    private studentVocabularyProgressService: StudentVocabularyProgressService,
  ) {}

  async create(
    createVocabularyItemDto: CreateVocabularyItemDto,
  ): Promise<VocabularyItem> {
    const existing = await this.vocabularyItemModel.findOne({
      where: {
        word: createVocabularyItemDto.word,
        uzbek: createVocabularyItemDto.uzbek,
        set_id: createVocabularyItemDto.set_id,
        unit_vocabulary_set_id: createVocabularyItemDto.unit_vocabulary_set_id,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Vocabulary item "${createVocabularyItemDto.word}" already exists in this set`,
      );
    }

    return this.vocabularyItemModel.create({ ...createVocabularyItemDto });
  }

  async createMany(
    createVocabularyItemDtos: CreateVocabularyItemDto[],
  ): Promise<VocabularyItem[]> {
    const newItems: CreateVocabularyItemDto[] = [];

    for (const dto of createVocabularyItemDtos) {
      const existing = await this.vocabularyItemModel.findOne({
        where: {
          word: dto.word,
          uzbek: dto.uzbek,
          set_id: dto.set_id,
          unit_vocabulary_set_id: dto.unit_vocabulary_set_id,
        },
      });

      if (!existing) {
        newItems.push(dto);
      }
    }

    if (newItems.length === 0) {
      return [];
    }

    const items = newItems.map((dto) => ({
      set_id: dto.set_id,
      unit_vocabulary_set_id: dto.unit_vocabulary_set_id,
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
        {
          model: UnitVocabularySet,
          as: "unit_vocabulary_set",
        },
      ],
    });
  }

  async findAllPaginated(
    query: QueryVocabularyItemDto,
    userId?: string,
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
        {
          model: UnitVocabularySet,
          as: "unit_vocabulary_set",
        },
      ],
      limit,
      offset,
      order,
    });

    // Get stats
    const stats = await this.getStats();

    let data = rows.map((row) => row.get({ plain: true }));

    if (userId && data.length > 0) {
      const itemsWithProgress = await Promise.all(
        data.map(async (vocabItem) => {
          const progress = await this.studentVocabularyProgressService.findWordStatus(
            userId,
            vocabItem.id,
          );
          return {
            ...vocabItem,
            progress_status: progress?.status || null,
          };
        }),
      );
      data = itemsWithProgress;
    }

    return {
      data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      stats,
    };
  }

  async getStats(setId?: string, unitSetId?: string): Promise<VocabularyItemStats> {
    const whereClause: WhereOptions = unitSetId
      ? { unit_vocabulary_set_id: unitSetId }
      : setId
        ? { set_id: setId }
        : {};

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
        {
          model: UnitVocabularySet,
          as: "unit_vocabulary_set",
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
        {
          model: UnitVocabularySet,
          as: "unit_vocabulary_set",
        },
      ],
    });
  }

  async findBySetIdPaginated(
    setId: string,
    query: QueryVocabularyItemDto,
    userId?: string,
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
        {
          model: UnitVocabularySet,
          as: "unit_vocabulary_set",
        },
      ],
      limit,
      offset,
      order,
    });

    // Get stats for this set
    const stats = await this.getStats(setId);

    let data = rows.map((row) => row.get({ plain: true }));

    if (userId && data.length > 0) {
      const itemsWithProgress = await Promise.all(
        data.map(async (vocabItem) => {
          const progress = await this.studentVocabularyProgressService.findWordStatus(
            userId,
            vocabItem.id,
          );
          return {
            ...vocabItem,
            progress_status: progress?.status || null,
          };
        }),
      );
      data = itemsWithProgress;
    }

    return {
      data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      stats,
    };
  }

  async findByUnitSetIdPaginated(
    unitSetId: string,
    query: QueryVocabularyItemDto,
    userId?: string,
  ): Promise<PaginatedVocabularyItemsResponse> {
    const page = query.page ? parseInt(query.page, 10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 10;
    const offset = (page - 1) * limit;

    const whereClause: WhereOptions = { unit_vocabulary_set_id: unitSetId };

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
        {
          model: UnitVocabularySet,
          as: "unit_vocabulary_set",
        },
      ],
      limit,
      offset,
      order,
    });

    // Get stats for this unit set
    const stats = await this.getStats(undefined, unitSetId);

    let data = rows.map((row) => row.get({ plain: true }));

    if (userId && data.length > 0) {
      const itemsWithProgress = await Promise.all(
        data.map(async (vocabItem) => {
          const progress = await this.studentVocabularyProgressService.findWordStatus(
            userId,
            vocabItem.id,
          );
          return {
            ...vocabItem,
            progress_status: progress?.status || null,
          };
        }),
      );
      data = itemsWithProgress;
    }

    return {
      data,
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

  async downloadExcelBySetId(setId: string): Promise<Buffer> {
    const items = await this.findBySetId(setId);
    return this.generateExcel(items);
  }

  async downloadExcelByUnitSetId(unitSetId: string): Promise<Buffer> {
    const items = await this.vocabularyItemModel.findAll({
      where: { unit_vocabulary_set_id: unitSetId },
      include: [
        {
          model: VocabularySet,
          as: "vocabulary_set",
        },
        {
          model: UnitVocabularySet,
          as: "unit_vocabulary_set",
        },
      ],
    });
    return this.generateExcel(items);
  }

  private async generateExcel(items: VocabularyItem[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Words");

    worksheet.columns = [
      { header: "word", key: "word", width: 25 },
      { header: "uzbek", key: "uzbek", width: 25 },
      { header: "rus", key: "rus", width: 25 },
      { header: "example", key: "example", width: 40 },
      { header: "audio_url", key: "audio_url", width: 40 },
      { header: "image_url", key: "image_url", width: 40 },
    ];

    items.forEach((item) => {
      worksheet.addRow({
        word: item.word,
        uzbek: item.uzbek,
        rus: item.rus,
        example: item.example,
        audio_url: item.audio_url,
        image_url: item.image_url,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as unknown as Buffer;
  }
}
