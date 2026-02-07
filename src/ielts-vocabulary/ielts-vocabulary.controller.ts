import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { IeltsVocabularyService } from "./ielts-vocabulary.service.js";
import { CreateIeltsVocabularyDto } from "./dto/create-ielts-vocabulary.dto.js";
import { UpdateIeltsVocabularyDto } from "./dto/update-ielts-vocabulary.dto.js";
import { CreateIeltsVocabularyDeckDto } from "./dto/create-ielts-vocabulary-deck.dto.js";
import { UpdateIeltsVocabularyDeckDto } from "./dto/update-ielts-vocabulary-deck.dto.js";
import { CreateIeltsDeckWordDto } from "./dto/create-ielts-deck-word.dto.js";
import { UpdateIeltsDeckWordDto } from "./dto/update-ielts-deck-word.dto.js";

@Controller("ielts-vocabulary")
export class IeltsVocabularyController {
  constructor(
    private readonly ieltsVocabularyService: IeltsVocabularyService,
  ) {}

  // ==================== IeltsVocabulary Endpoints ====================

  @Post()
  create(@Body() createIeltsVocabularyDto: CreateIeltsVocabularyDto) {
    return this.ieltsVocabularyService.create(createIeltsVocabularyDto);
  }

  @Get()
  findAll(@Query("page") page?: number, @Query("limit") limit?: number) {
    return this.ieltsVocabularyService.findAll(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ieltsVocabularyService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateIeltsVocabularyDto: UpdateIeltsVocabularyDto,
  ) {
    return this.ieltsVocabularyService.update(id, updateIeltsVocabularyDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.ieltsVocabularyService.remove(id);
  }

  // ==================== IeltsVocabularyDeck Endpoints ====================

  @Post("decks")
  createDeck(@Body() createDeckDto: CreateIeltsVocabularyDeckDto) {
    return this.ieltsVocabularyService.createDeck(createDeckDto);
  }

  @Get("decks/all")
  findAllDecks(
    @Query("vocabularyId") vocabularyId?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    return this.ieltsVocabularyService.findAllDecks(
      vocabularyId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }

  @Get("decks/:id")
  findOneDeck(@Param("id") id: string) {
    return this.ieltsVocabularyService.findOneDeck(id);
  }

  @Patch("decks/:id")
  updateDeck(
    @Param("id") id: string,
    @Body() updateDeckDto: UpdateIeltsVocabularyDeckDto,
  ) {
    return this.ieltsVocabularyService.updateDeck(id, updateDeckDto);
  }

  @Delete("decks/:id")
  removeDeck(@Param("id") id: string) {
    return this.ieltsVocabularyService.removeDeck(id);
  }

  // ==================== IeltsDeckWord Endpoints ====================

  @Post("words")
  createWord(@Body() createWordDto: CreateIeltsDeckWordDto) {
    return this.ieltsVocabularyService.createWord(createWordDto);
  }

  @Get("words/all")
  findAllWords(
    @Query("deckId") deckId?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    return this.ieltsVocabularyService.findAllWords(
      deckId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }

  @Get("words/:id")
  findOneWord(@Param("id") id: string) {
    return this.ieltsVocabularyService.findOneWord(id);
  }

  @Patch("words/:id")
  updateWord(
    @Param("id") id: string,
    @Body() updateWordDto: UpdateIeltsDeckWordDto,
  ) {
    return this.ieltsVocabularyService.updateWord(id, updateWordDto);
  }

  @Delete("words/:id")
  removeWord(@Param("id") id: string) {
    return this.ieltsVocabularyService.removeWord(id);
  }
}
