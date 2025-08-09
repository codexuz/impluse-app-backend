import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UnitVocabularySetService } from './unit-vocabulary-set.service.js';
import { CreateUnitVocabularySetDto } from './dto/create-unit_vocabulary_set.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('unit-vocabulary-sets')
export class UnitVocabularySetController {
  constructor(private readonly unitVocabularySetService: UnitVocabularySetService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('admin', 'teacher')
  async create(@Body() createUnitVocabularySetDto: CreateUnitVocabularySetDto) {
    return await this.unitVocabularySetService.create(createUnitVocabularySetDto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  @Roles('admin', 'teacher')
  async createMany(@Body() createDtos: CreateUnitVocabularySetDto[]) {
    return await this.unitVocabularySetService.createMany(createDtos);
  }

  @Get()
  @Roles('admin', 'teacher')
  async findAll() {
    return await this.unitVocabularySetService.findAll();
  }

  @Get('unit/:unitId')
  @Roles('admin', 'teacher', 'student')
  async findByUnitId(@Param('unitId') unitId: string) {
    return await this.unitVocabularySetService.findByUnitId(unitId);
  }

  @Get(':id')
  @Roles('admin', 'teacher', 'student')
  async findOne(@Param('id') id: string) {
    return await this.unitVocabularySetService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin', 'teacher')
  async remove(@Param('id') id: string) {
    return await this.unitVocabularySetService.remove(id);
  }

  @Delete('unit/:unitId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin', 'teacher')
  async removeByUnitId(@Param('unitId') unitId: string) {
    return await this.unitVocabularySetService.removeByUnitId(unitId);
  }

  @Delete('vocabulary/:vocabularyItemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin', 'teacher')
  async removeByVocabularyItemId(@Param('vocabularyItemId') vocabularyItemId: string) {
    return await this.unitVocabularySetService.removeByVocabularyItemId(vocabularyItemId);
  }
}
