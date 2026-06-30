import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExamResultsService } from './exam-results.service.js';
import { CreateExamResultDto } from './dto/create-exam-result.dto.js';
import { UpdateExamResultDto } from './dto/update-exam-result.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Exam Results')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exam-results')
export class ExamResultsController {
  constructor(private readonly examResultsService: ExamResultsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new exam result' })
  @ApiResponse({ status: 201, description: 'The exam result has been successfully created' })
  create(@Body() createExamResultDto: CreateExamResultDto) {
    return this.examResultsService.create(createExamResultDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({ summary: 'Get all exam results' })
  findAll() {
    return this.examResultsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get a specific exam result by ID' })
  @ApiParam({ name: 'id', description: 'Exam result ID' })
  findOne(@Param('id') id: string) {
    return this.examResultsService.findOne(id);
  }

  @Get('exam/:examId')
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({ summary: 'Get all results for a specific exam' })
  @ApiParam({ name: 'examId', description: 'Exam ID' })
  findByExam(@Param('examId') examId: string) {
    return this.examResultsService.findByExam(examId);
  }

  @Get('student/:studentId')
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all exam results for a specific student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  findByStudent(@Param('studentId') studentId: string) {
    return this.examResultsService.findByStudent(studentId);
  }

  @Get('exam/:examId/student/:studentId')
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get exam result for a specific exam and student' })
  @ApiParam({ name: 'examId', description: 'Exam ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  findByExamAndStudent(
    @Param('examId') examId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.examResultsService.findByExamAndStudent(examId, studentId);
  }

  @Get('unit-test-failures/level/:levelId')
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({
    summary:
      'Get students who failed unit tests at least N times within a level',
  })
  @ApiParam({
    name: 'levelId',
    description: 'Level (course) UUID, matched against exams.level_id',
  })
  @ApiQuery({
    name: 'minFailures',
    required: false,
    description: 'Minimum number of failed unit tests (default 3)',
    example: 3,
  })
  @ApiQuery({
    name: 'groupId',
    required: false,
    description: 'Only count unit tests of this group',
  })
  @ApiQuery({
    name: 'teacherId',
    required: false,
    description: 'Only count unit tests of this teacher',
  })
  @ApiQuery({
    name: 'unitId',
    required: false,
    description: 'Only count unit tests of this unit',
  })
  findUnitTestFailuresByLevel(
    @Param('levelId') levelId: string,
    @Query('minFailures') minFailures?: string,
    @Query('groupId') groupId?: string,
    @Query('teacherId') teacherId?: string,
    @Query('unitId') unitId?: string,
  ) {
    return this.examResultsService.findUnitTestFailuresByLevel({
      levelId,
      minFailures: minFailures ? parseInt(minFailures, 10) : 3,
      groupId,
      teacherId,
      unitId,
    });
  }

  @Get('exam/:examId/statistics')
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({ summary: 'Get statistics for a specific exam' })
  @ApiParam({ name: 'examId', description: 'Exam ID' })
  getExamStatistics(@Param('examId') examId: string) {
    return this.examResultsService.getExamStatistics(examId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({ summary: 'Update an exam result' })
  @ApiParam({ name: 'id', description: 'Exam result ID' })
  update(@Param('id') id: string, @Body() updateExamResultDto: UpdateExamResultDto) {
    return this.examResultsService.update(id, updateExamResultDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an exam result' })
  @ApiParam({ name: 'id', description: 'Exam result ID' })
  remove(@Param('id') id: string) {
    return this.examResultsService.remove(id);
  }
}
