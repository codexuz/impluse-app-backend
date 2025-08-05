import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';
import { LessonService } from './lesson.service.js';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';
import { Lesson } from './entities/lesson.entity.js';

@ApiTags('lessons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new lesson' })
  @ApiResponse({ 
    status: 201, 
    description: 'The lesson has been successfully created.',
    type: Lesson
  })
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonService.create(createLessonDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all lessons' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all lessons',
    type: [Lesson]
  })
  findAll() {
    return this.lessonService.findAll();
  }

  @Get('my-lessons/:student_id')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get lessons assigned to a student' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns lessons assigned to the student',
    type: [Lesson]
  })
  findMyLessons(@Param('student_id') student_id: string) {
    return this.lessonService.findMyLessons(student_id);
  }
  

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get a specific lesson by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the lesson',
    type: Lesson
  })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(id);
  }

  @Get(':id/content')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get a lesson with its content' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the lesson with content',
    type: Lesson
  })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  findWithContent(@Param('id') id: string) {
    return this.lessonService.findOneWithContent(id);
  }

  @Get(':id/vocabulary')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get a lesson with its vocabulary sets' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the lesson with vocabulary sets',
    type: Lesson
  })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  findWithVocabulary(@Param('id') id: string) {
    return this.lessonService.findOneWithVocabulary(id);
  }

  @Get(':id/exercise')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get a lesson with its exercises' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the lesson with exercises',
    type: Lesson
  })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  findWithExercise(@Param('id') id: string) {
    return this.lessonService.findOneWithExercises(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update a lesson' })
  @ApiResponse({ 
    status: 200, 
    description: 'The lesson has been successfully updated.',
    type: Lesson
  })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonService.update(id, updateLessonDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Delete a lesson' })
  @ApiResponse({ status: 200, description: 'The lesson has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  remove(@Param('id') id: string) {
    return this.lessonService.remove(id);
  }

  @Get('unit/:unitId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all lessons for a specific unit' })
  @ApiParam({ name: 'unitId', description: 'Unit ID', type: 'string' })
  @ApiQuery({ name: 'throwIfEmpty', required: false, type: 'boolean', description: 'Throw error if no lessons found' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all lessons for the unit',
    type: [Lesson]
  })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  findByUnit(
    @Param('unitId') unitId: string,
    @Query('throwIfEmpty') throwIfEmpty?: string
  ) {
    const shouldThrow = throwIfEmpty === 'true';
    return this.lessonService.findByUnit(unitId, shouldThrow);
  }

  @Get('module/:moduleId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all lessons for a specific module' })
  @ApiParam({ name: 'moduleId', description: 'Module ID', type: 'string' })
  @ApiQuery({ name: 'includeContent', required: false, type: 'boolean', description: 'Include lesson content' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all lessons for the module',
    type: [Lesson]
  })
  findByModule(
    @Param('moduleId') moduleId: string,
    @Query('includeContent') includeContent?: string
  ) {
    const shouldIncludeContent = includeContent === 'true';
    return this.lessonService.findByModuleId(moduleId, shouldIncludeContent);
  }

  @Get('module/:moduleId/with-content')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all lessons for a specific module with content' })
  @ApiParam({ name: 'moduleId', description: 'Module ID', type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all lessons for the module with lesson content',
    type: [Lesson]
  })
  findByModuleWithContent(@Param('moduleId') moduleId: string) {
    return this.lessonService.findByModuleId(moduleId, true);
  }

  @Get('module/:moduleId/with-exercises')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all lessons for a specific module with exercises' })
  @ApiParam({ name: 'moduleId', description: 'Module ID', type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all lessons for the module with exercises',
    type: [Lesson]
  })
  findByModuleWithExercises(@Param('moduleId') moduleId: string) {
    return this.lessonService.findByModuleIdWithExercises(moduleId);
  }

  @Get('module/:moduleId/with-vocabulary')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all lessons for a specific module with vocabulary' })
  @ApiParam({ name: 'moduleId', description: 'Module ID', type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all lessons for the module with vocabulary sets',
    type: [Lesson]
  })
  findByModuleWithVocabulary(@Param('moduleId') moduleId: string) {
    return this.lessonService.findByModuleIdWithVocabulary(moduleId);
  }

}
