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
  HttpStatus
} from '@nestjs/common';
import { VocabularyItemsService } from './vocabulary_items.service.js';
import { CreateVocabularyItemDto } from './dto/create-vocabulary_item.dto.js';
import { UpdateVocabularyItemDto } from './dto/update-vocabulary_item.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('vocabulary-items')
@UseGuards(JwtAuthGuard)
export class VocabularyItemsController {
  constructor(private readonly vocabularyItemsService: VocabularyItemsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'teacher')
  create(@Body() createVocabularyItemDto: CreateVocabularyItemDto) {
    return this.vocabularyItemsService.create(createVocabularyItemDto);
  }

  @Post('bulk')
  @UseGuards(RolesGuard)
  @Roles('admin', 'teacher')
  createMany(@Body() createVocabularyItemDtos: CreateVocabularyItemDto[]) {
    return this.vocabularyItemsService.createMany(createVocabularyItemDtos);
  }

  @Get()
  findAll() {
    return this.vocabularyItemsService.findAll();
  }

  @Get('set/:setId')
  findBySetId(@Param('setId') setId: string) {
    return this.vocabularyItemsService.findBySetId(setId);
  }

  @Get('word/:word')
  findByWord(@Param('word') word: string) {
    return this.vocabularyItemsService.findByWord(word);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocabularyItemsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'teacher')
  update(@Param('id') id: string, @Body() updateVocabularyItemDto: UpdateVocabularyItemDto) {
    return this.vocabularyItemsService.update(id, updateVocabularyItemDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'teacher')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.vocabularyItemsService.remove(id);
  }

  @Delete('set/:setId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'teacher')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeBySetId(@Param('setId') setId: string) {
    return this.vocabularyItemsService.removeBySetId(setId);
  }
}
