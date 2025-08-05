import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LessonContentService } from './lesson-content.service.js';
import { CreateLessonContentDto } from './dto/create-lesson-content.dto.js';
import { UpdateLessonContentDto } from './dto/update-lesson-content.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';

@ApiTags('lesson-content')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('lesson-content')
export class LessonContentController {
  constructor(private readonly lessonContentService: LessonContentService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new lesson content' })
  @ApiResponse({ status: 201, description: 'The lesson content has been created successfully.' })
  create(@Body() createLessonContentDto: CreateLessonContentDto) {
    return this.lessonContentService.create(createLessonContentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lesson contents' })
  @ApiResponse({ status: 200, description: 'Return all active lesson contents.' })
  findAll() {
    return this.lessonContentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lesson content by id' })
  @ApiResponse({ status: 200, description: 'Return the lesson content.' })
  @ApiResponse({ status: 404, description: 'Lesson content not found.' })
  findOne(@Param('id') id: string) {
    return this.lessonContentService.findOne(id);
  }

  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Get all lesson contents by lesson ID' })
  @ApiResponse({ status: 200, description: 'Returns all lesson contents for the specified lesson.' })
  @ApiResponse({ status: 404, description: 'No content found for the specified lesson.' })
  findByLessonId(@Param('lessonId') lessonId: string) {
    return this.lessonContentService.findByLessonId(lessonId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update a lesson content' })
  @ApiResponse({ status: 200, description: 'The lesson content has been updated successfully.' })
  update(@Param('id') id: string, @Body() updateLessonContentDto: UpdateLessonContentDto) {
    return this.lessonContentService.update(id, updateLessonContentDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Soft delete a lesson content' })
  @ApiResponse({ status: 200, description: 'The lesson content has been deactivated successfully.' })
  remove(@Param('id') id: string) {
    return this.lessonContentService.remove(id);
  }
}