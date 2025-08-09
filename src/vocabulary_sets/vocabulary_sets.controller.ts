import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { VocabularySetsService } from './vocabulary_sets.service.js';
import { CreateVocabularySetDto } from './dto/create-vocabulary_set.dto.js';
import { UpdateVocabularySetDto } from './dto/update-vocabulary_set.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('vocabulary-sets')
@UseGuards(JwtAuthGuard)
export class VocabularySetsController {
  constructor(private readonly vocabularySetsService: VocabularySetsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'teacher')
  create(@Body() createVocabularySetDto: CreateVocabularySetDto) {
    return this.vocabularySetsService.create(createVocabularySetDto);
  }

  @Get()
  findAll() {
    return this.vocabularySetsService.findAll();
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.vocabularySetsService.findByCourse(courseId);
  }

  @Get('level/:level')
  findByLevel(@Param('level') level: string) {
    return this.vocabularySetsService.findByLevel(level);
  }

  @Get('topic/:topic')
  findByTopic(@Param('topic') topic: string) {
    return this.vocabularySetsService.findByTopic(topic);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocabularySetsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'teacher')
  update(@Param('id') id: string, @Body() updateVocabularySetDto: UpdateVocabularySetDto) {
    return this.vocabularySetsService.update(id, updateVocabularySetDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'teacher')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.vocabularySetsService.remove(id);
  }
}
