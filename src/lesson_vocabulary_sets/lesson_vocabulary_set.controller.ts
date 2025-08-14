import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { LessonVocabularySetService } from './lesson_vocabulary_set.service.js';
import { CreateLessonVocabularySetDto } from './dto/create-lesson-vocabulary-set.dto.js';
import { UpdateLessonVocabularySetDto } from './dto/update-lesson-vocabulary-set.dto.js';
import { LessonVocabularySet } from './entities/lesson_vocabulary_set.entity.js';

@ApiTags('lesson-vocabulary-sets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lesson-vocabulary-sets')
export class LessonVocabularySetController {
  constructor(private readonly lessonVocabularySetService: LessonVocabularySetService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new lesson vocabulary set' })
  @ApiResponse({ 
    status: 201, 
    description: 'The lesson vocabulary set has been successfully created.',
    type: LessonVocabularySet
  })
  create(@Body() createLessonVocabularySetDto: CreateLessonVocabularySetDto) {
    return this.lessonVocabularySetService.create(createLessonVocabularySetDto);
  }

  @Post('bulk')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create multiple lesson vocabulary sets' })
  @ApiResponse({ 
    status: 201, 
    description: 'The lesson vocabulary sets have been successfully created.',
    type: [LessonVocabularySet]
  })
  createMany(@Body() createLessonVocabularySetDtos: CreateLessonVocabularySetDto[]) {
    return this.lessonVocabularySetService.createMany(createLessonVocabularySetDtos);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all lesson vocabulary sets' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all lesson vocabulary sets',
    type: [LessonVocabularySet]
  })
  findAll() {
    return this.lessonVocabularySetService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get a specific lesson vocabulary set by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the lesson vocabulary set',
    type: LessonVocabularySet
  })
  @ApiResponse({ status: 404, description: 'Set not found' })
  findOne(@Param('id') id: string) {
    return this.lessonVocabularySetService.findOne(id);
  }

  @Get('lesson/:lesson_id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all vocabulary sets for a lesson' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all vocabulary sets for the specified lesson',
    type: [LessonVocabularySet]
  })
  findByLessonId(@Param('lesson_id') lesson_id: string) {
    return this.lessonVocabularySetService.findByLessonId(lesson_id);
  }

  @Get('vocabulary/:vocabulary_item_id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all lesson associations for a vocabulary item' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all lesson associations for the specified vocabulary item',
    type: [LessonVocabularySet]
  })
  findByVocabularyItemId(@Param('vocabulary_item_id') vocabulary_item_id: string) {
    return this.lessonVocabularySetService.findByVocabularyItemId(vocabulary_item_id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update a lesson vocabulary set' })
  @ApiResponse({ 
    status: 200, 
    description: 'The lesson vocabulary set has been successfully updated.',
    type: LessonVocabularySet
  })
  @ApiResponse({ status: 404, description: 'Set not found' })
  update(@Param('id') id: string, @Body() updateLessonVocabularySetDto: UpdateLessonVocabularySetDto) {
    return this.lessonVocabularySetService.update(id, updateLessonVocabularySetDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Delete a lesson vocabulary set' })
  @ApiResponse({ status: 200, description: 'The lesson vocabulary set has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Set not found' })
  remove(@Param('id') id: string) {
    return this.lessonVocabularySetService.remove(id);
  }

  @Delete('lesson/:lesson_id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Delete all vocabulary sets for a lesson' })
  @ApiResponse({ status: 200, description: 'The vocabulary sets have been successfully deleted.' })
  removeByLessonId(@Param('lesson_id') lesson_id: string) {
    return this.lessonVocabularySetService.removeByLessonId(lesson_id);
  }
}
