import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateIeltsVocabularyDto } from "./dto/create-ielts-vocabulary.dto.js";
import { UpdateIeltsVocabularyDto } from "./dto/update-ielts-vocabulary.dto.js";
import { CreateIeltsVocabularyDeckDto } from "./dto/create-ielts-vocabulary-deck.dto.js";
import { UpdateIeltsVocabularyDeckDto } from "./dto/update-ielts-vocabulary-deck.dto.js";
import { CreateIeltsDeckWordDto } from "./dto/create-ielts-deck-word.dto.js";
import { UpdateIeltsDeckWordDto } from "./dto/update-ielts-deck-word.dto.js";
import { IeltsVocabulary } from "./entities/ielts-vocabulary.entity.js";
import { IeltsVocabularyDeck } from "./entities/ielts-vocabulary-deck.entity.js";
import { IeltsDeckWord } from "./entities/ielts-deck-word.entity.js";

@Injectable()
export class IeltsVocabularyService {
  constructor(
    @InjectModel(IeltsVocabulary)
    private ieltsVocabularyModel: typeof IeltsVocabulary,
    @InjectModel(IeltsVocabularyDeck)
    private ieltsVocabularyDeckModel: typeof IeltsVocabularyDeck,
    @InjectModel(IeltsDeckWord)
    private ieltsVocabularyWordModel: typeof IeltsDeckWord,
  ) {}

  // ==================== IeltsVocabulary CRUD ====================

  async create(
    createIeltsVocabularyDto: CreateIeltsVocabularyDto,
  ): Promise<IeltsVocabulary> {
    return this.ieltsVocabularyModel.create({ ...createIeltsVocabularyDto });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: IeltsVocabulary[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;

    const { count, rows } = await this.ieltsVocabularyModel.findAndCountAll({
      include: [
        {
          model: IeltsVocabularyDeck,
          as: "decks",
          include: [
            {
              model: IeltsDeckWord,
              as: "words",
            },
          ],
        },
      ],
      limit,
      offset,
      distinct: true,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: string): Promise<IeltsVocabulary> {
    const vocabulary = await this.ieltsVocabularyModel.findByPk(id, {
      include: [
        {
          model: IeltsVocabularyDeck,
          as: "decks",
          include: [
            {
              model: IeltsDeckWord,
              as: "words",
            },
          ],
        },
      ],
    });
    if (!vocabulary) {
      throw new NotFoundException(`IELTS Vocabulary with ID "${id}" not found`);
    }
    return vocabulary;
  }

  async update(
    id: string,
    updateIeltsVocabularyDto: UpdateIeltsVocabularyDto,
  ): Promise<IeltsVocabulary> {
    const vocabulary = await this.findOne(id);
    await vocabulary.update(updateIeltsVocabularyDto);
    return vocabulary;
  }

  async remove(id: string): Promise<void> {
    const vocabulary = await this.findOne(id);
    await vocabulary.destroy();
  }

  // ==================== IeltsVocabularyDeck CRUD ====================

  async createDeck(
    createDeckDto: CreateIeltsVocabularyDeckDto,
  ): Promise<IeltsVocabularyDeck> {
    // Verify parent vocabulary exists
    await this.findOne(createDeckDto.ielts_vocabulary_id);
    return this.ieltsVocabularyDeckModel.create({ ...createDeckDto });
  }

  async findAllDecks(
    vocabularyId?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: IeltsVocabularyDeck[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const where = vocabularyId ? { ielts_vocabulary_id: vocabularyId } : {};

    const { count, rows } = await this.ieltsVocabularyDeckModel.findAndCountAll(
      {
        where,
        include: [
          {
            model: IeltsDeckWord,
            as: "words",
          },
        ],
        limit,
        offset,
        distinct: true,
      },
    );

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOneDeck(id: string): Promise<IeltsVocabularyDeck> {
    const deck = await this.ieltsVocabularyDeckModel.findByPk(id, {
      include: [
        {
          model: IeltsDeckWord,
          as: "words",
        },
      ],
    });
    if (!deck) {
      throw new NotFoundException(
        `IELTS Vocabulary Deck with ID "${id}" not found`,
      );
    }
    return deck;
  }

  async updateDeck(
    id: string,
    updateDeckDto: UpdateIeltsVocabularyDeckDto,
  ): Promise<IeltsVocabularyDeck> {
    const deck = await this.findOneDeck(id);
    await deck.update(updateDeckDto);
    return deck;
  }

  async removeDeck(id: string): Promise<void> {
    const deck = await this.findOneDeck(id);
    await deck.destroy();
  }

  // ==================== IeltsDeckWord CRUD ====================

  async createWord(
    createWordDto: CreateIeltsDeckWordDto,
  ): Promise<IeltsDeckWord> {
    // Verify parent deck exists
    await this.findOneDeck(createWordDto.deck_id);
    return this.ieltsVocabularyWordModel.create({ ...createWordDto });
  }

  async findAllWords(
    deckId?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: IeltsDeckWord[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const where = deckId ? { deck_id: deckId } : {};

    const { count, rows } = await this.ieltsVocabularyWordModel.findAndCountAll(
      {
        where,
        limit,
        offset,
        distinct: true,
      },
    );

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOneWord(id: string): Promise<IeltsDeckWord> {
    const word = await this.ieltsVocabularyWordModel.findByPk(id);
    if (!word) {
      throw new NotFoundException(`IELTS Deck Word with ID "${id}" not found`);
    }
    return word;
  }

  async updateWord(
    id: string,
    updateWordDto: UpdateIeltsDeckWordDto,
  ): Promise<IeltsDeckWord> {
    const word = await this.findOneWord(id);
    await word.update(updateWordDto);
    return word;
  }

  async removeWord(id: string): Promise<void> {
    const word = await this.findOneWord(id);
    await word.destroy();
  }
}
