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
} from '@nestjs/common';
import { StudentVocabularyProgressService } from './student-vocabulary-progress.service.js';
import { CreateStudentVocabularyProgressDto } from './dto/create-student-vocabulary-progress.dto.js';
import { UpdateStudentVocabularyProgressDto } from './dto/update-student-vocabulary-progress.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { VocabularyProgressStatus } from './enums/vocabulary-progress-status.enum.js';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Student Vocabulary Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('student-vocabulary-progress')
export class StudentVocabularyProgressController {
  constructor(private readonly progressService: StudentVocabularyProgressService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new vocabulary progress record' })
  @ApiResponse({ status: 201, description: 'Progress record created successfully' })
  create(@Body() createDto: CreateStudentVocabularyProgressDto) {
    return this.progressService.create(createDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all vocabulary progress records' })
  findAll() {
    return this.progressService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get progress record by id' })
  @ApiParam({ name: 'id', description: 'Progress record ID' })
  findOne(@Param('id') id: string) {
    return this.progressService.findOne(id);
  }

  @Get('student/:studentId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all progress records for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  findByStudent(@Param('studentId') studentId: string) {
    return this.progressService.findByStudent(studentId);
  }

  @Get('vocabulary/:vocabularyItemId')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all progress records for a vocabulary item' })
  @ApiParam({ name: 'vocabularyItemId', description: 'Vocabulary Item ID' })
  findByVocabularyItem(@Param('vocabularyItemId') vocabularyItemId: string) {
    return this.progressService.findByVocabularyItem(vocabularyItemId);
  }

  @Get('student/:studentId/vocabulary/:vocabularyItemId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get progress record for a specific student and vocabulary item' })
  findByStudentAndVocabularyItem(
    @Param('studentId') studentId: string,
    @Param('vocabularyItemId') vocabularyItemId: string,
  ) {
    return this.progressService.findByStudentAndVocabularyItem(studentId, vocabularyItemId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Update progress record' })
  @ApiParam({ name: 'id', description: 'Progress record ID' })
  update(@Param('id') id: string, @Body() updateDto: UpdateStudentVocabularyProgressDto) {
    return this.progressService.update(id, updateDto);
  }

  @Patch(':id/status/:status')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Update progress status' })
  @ApiParam({ name: 'id', description: 'Progress record ID' })
  @ApiParam({ name: 'status', enum: VocabularyProgressStatus })
  updateStatus(
    @Param('id') id: string,
    @Param('status') status: VocabularyProgressStatus,
  ) {
    return this.progressService.updateStatus(id, status);
  }

  @Get('stats/student/:studentId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get vocabulary progress statistics for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  getStudentStats(@Param('studentId') studentId: string) {
    return this.progressService.getStudentProgressStats(studentId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete progress record' })
  @ApiParam({ name: 'id', description: 'Progress record ID' })
  remove(@Param('id') id: string) {
    return this.progressService.remove(id);
  }
}
