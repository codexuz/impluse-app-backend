import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { VocabularyItemsService } from "./vocabulary_items.service.js";
import { CreateVocabularyItemDto } from "./dto/create-vocabulary_item.dto.js";
import { UpdateVocabularyItemDto } from "./dto/update-vocabulary_item.dto.js";
import { QueryVocabularyItemDto } from "./dto/query-vocabulary_item.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";

@Controller("vocabulary-items")
@UseGuards(JwtAuthGuard)
export class VocabularyItemsController {
  constructor(
    private readonly vocabularyItemsService: VocabularyItemsService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles("admin", "teacher")
  create(@Body() createVocabularyItemDto: CreateVocabularyItemDto) {
    return this.vocabularyItemsService.create(createVocabularyItemDto);
  }

  @Post("bulk")
  @UseGuards(RolesGuard)
  @Roles("admin", "teacher")
  createMany(@Body() createVocabularyItemDtos: CreateVocabularyItemDto[]) {
    return this.vocabularyItemsService.createMany(createVocabularyItemDtos);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles("admin", "teacher", "student")
  findAll(@Query() query: QueryVocabularyItemDto) {
    return this.vocabularyItemsService.findAllPaginated(query);
  }

  @Get("stats")
  @UseGuards(RolesGuard)
  @Roles("admin", "teacher")
  getStats() {
    return this.vocabularyItemsService.getStats();
  }

  @Get("set/:setId/stats")
  @UseGuards(RolesGuard)
  @Roles("admin", "teacher")
  getStatsBySetId(@Param("setId") setId: string) {
    return this.vocabularyItemsService.getStats(setId);
  }

  @Get("set/:setId")
  findBySetId(@Param("setId") setId: string) {
    return this.vocabularyItemsService.findBySetId(setId);
  }

  @Get("set/:setId/paginated")
  findBySetIdPaginated(
    @Param("setId") setId: string,
    @Query() query: QueryVocabularyItemDto,
  ) {
    return this.vocabularyItemsService.findBySetIdPaginated(setId, query);
  }

  @Get("word/:word")
  findByWord(@Param("word") word: string) {
    return this.vocabularyItemsService.findByWord(word);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.vocabularyItemsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles("admin", "teacher")
  update(
    @Param("id") id: string,
    @Body() updateVocabularyItemDto: UpdateVocabularyItemDto,
  ) {
    return this.vocabularyItemsService.update(id, updateVocabularyItemDto);
  }

  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles("admin", "teacher")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.vocabularyItemsService.remove(id);
  }

  @Delete("set/:setId")
  @UseGuards(RolesGuard)
  @Roles("admin", "teacher")
  @HttpCode(HttpStatus.NO_CONTENT)
  removeBySetId(@Param("setId") setId: string) {
    return this.vocabularyItemsService.removeBySetId(setId);
  }
}
