import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { LessonProgressService } from './lesson_progress.service.js';
import { CreateLessonProgressDto } from './dto/create-lesson-progress.dto.js';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto.js';
import { LessonProgress } from './entities/lesson_progress.entity.js';

@ApiTags('lesson-progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lesson-progress')
export class LessonProgressController {
  constructor(private readonly lessonProgressService: LessonProgressService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new lesson progress record' })
  @ApiResponse({ status: 201, type: LessonProgress })
  create(@Body() createLessonProgressDto: CreateLessonProgressDto) {
    return this.lessonProgressService.create(createLessonProgressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lesson progress records' })
  @ApiResponse({ status: 200, type: [LessonProgress] })
  findAll() {
    return this.lessonProgressService.findAll();
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get lesson progress by student ID' })
  @ApiResponse({ status: 200, type: [LessonProgress] })
  findByStudentId(@Param('studentId') studentId: string) {
    return this.lessonProgressService.findByStudentId(studentId);
  }

  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Get lesson progress by lesson ID' })
  @ApiResponse({ status: 200, type: [LessonProgress] })
  findByLessonId(@Param('lessonId') lessonId: string) {
    return this.lessonProgressService.findByLessonId(lessonId);
  }

  @Get('student/:studentId/lesson/:lessonId')
  @ApiOperation({ summary: 'Get lesson progress by student ID and lesson ID' })
  @ApiResponse({ status: 200, type: LessonProgress })
  @ApiResponse({ status: 404, description: 'Not found' })
  findByStudentAndLesson(
    @Param('studentId') studentId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.lessonProgressService.findByStudentAndLesson(studentId, lessonId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lesson progress record by ID' })
  @ApiResponse({ status: 200, type: LessonProgress })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(@Param('id') id: string) {
    return this.lessonProgressService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update a lesson progress record' })
  @ApiResponse({ status: 200, type: LessonProgress })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(@Param('id') id: string, @Body() updateLessonProgressDto: UpdateLessonProgressDto) {
    return this.lessonProgressService.update(id, updateLessonProgressDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a lesson progress record' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Not found' })
  remove(@Param('id') id: string) {
    return this.lessonProgressService.remove(id);
  }
}
