import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
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

  @Get('student/:studentId/overall')
  @ApiOperation({ summary: 'Get overall progress summary for student' })
  @ApiResponse({ status: 200 })
  getStudentOverallProgress(@Param('studentId') studentId: string) {
    return this.lessonProgressService.getStudentOverallProgress(studentId);
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

  @Get('student/:studentId/lesson/:lessonId/detailed')
  @ApiOperation({ summary: 'Get detailed lesson progress with sections breakdown' })
  @ApiResponse({ status: 200 })
  getDetailedProgress(
    @Param('studentId') studentId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.lessonProgressService.getProgressByLessonAndStudent(studentId, lessonId);
  }

  @Post('student/:studentId/lesson/:lessonId/section/:section')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Update section progress for a lesson' })
  @ApiResponse({ status: 200, type: LessonProgress })
  updateSectionProgress(
    @Param('studentId') studentId: string,
    @Param('lessonId') lessonId: string,
    @Param('section') section: string,
  ) {
    return this.lessonProgressService.updateSectionProgress(studentId, lessonId, section);
  }

  @Post('update-from-homework/:studentId/:homeworkId/:section')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Update lesson progress based on homework submission' })
  @ApiResponse({ status: 200, type: LessonProgress })
  updateFromHomeworkSubmission(
    @Param('studentId') studentId: string,
    @Param('homeworkId') homeworkId: string,
    @Param('section') section: string,
  ) {
    return this.lessonProgressService.updateProgressFromHomeworkSubmission(studentId, homeworkId, section);
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

  // Statistics endpoints
  @Get('stats/section-progress')
  @ApiOperation({ summary: 'Get overall section progress statistics' })
  @ApiResponse({ status: 200 })
  getSectionProgressStats() {
    return this.lessonProgressService.getSectionProgressStats();
  }

  @Get('stats/student/:studentId/sections')
  @ApiOperation({ summary: 'Get section progress statistics for a specific student' })
  @ApiResponse({ status: 200 })
  getStudentSectionProgressStats(@Param('studentId') studentId: string) {
    return this.lessonProgressService.getStudentSectionProgressStats(studentId);
  }

  @Get('stats/lesson/:lessonId/sections')
  @ApiOperation({ summary: 'Get section progress statistics for a specific lesson' })
  @ApiResponse({ status: 200 })
  getLessonSectionProgressStats(@Param('lessonId') lessonId: string) {
    return this.lessonProgressService.getLessonSectionProgressStats(lessonId);
  }

  @Get('stats/average-progress')
  @ApiOperation({ summary: 'Get average progress across all sections' })
  @ApiResponse({ status: 200 })
  getAverageSectionProgress() {
    return this.lessonProgressService.getAverageSectionProgress();
  }

  @Get('stats/top-performers/:section')
  @ApiOperation({ summary: 'Get top performing students by section' })
  @ApiResponse({ status: 200 })
  getTopPerformingStudentsBySection(
    @Param('section') section: string,
    @Query('limit') limit?: string,
  ) {
    const limitNumber = limit ? parseInt(limit) : 10;
    return this.lessonProgressService.getTopPerformingStudentsBySection(section, limitNumber);
  }

  @Get('stats/comprehensive-report')
  @ApiOperation({ summary: 'Get comprehensive progress report with all statistics' })
  @ApiResponse({ status: 200 })
  getComprehensiveProgressReport() {
    return this.lessonProgressService.getComprehensiveProgressReport();
  }

  @Post('stats/compare-students')
  @ApiOperation({ summary: 'Compare progress between multiple students' })
  @ApiResponse({ status: 200 })
  getStudentComparisonStats(@Body() body: { student_ids: string[] }) {
    return this.lessonProgressService.getStudentComparisonStats(body.student_ids);
  }

  @Get('stats/trends')
  @ApiOperation({ summary: 'Get progress trends over time' })
  @ApiResponse({ status: 200 })
  getProgressTrends(@Query('days') days?: string) {
    const daysNumber = days ? parseInt(days) : 30;
    return this.lessonProgressService.getProgressTrends(daysNumber);
  }
}
