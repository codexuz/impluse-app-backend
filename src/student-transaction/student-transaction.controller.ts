import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { StudentTransactionService } from './student-transaction.service.js';
import { CreateStudentTransactionDto } from './dto/create-student-transaction.dto.js';
import { UpdateStudentTransactionDto } from './dto/update-student-transaction.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Student Transaction')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('student-transaction')
export class StudentTransactionController {
  constructor(private readonly studentTransactionService: StudentTransactionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new student transaction' })
  create(@Body() createStudentTransactionDto: CreateStudentTransactionDto) {
    return this.studentTransactionService.create(createStudentTransactionDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all student transactions' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by transaction type' })
  findAll(@Query('type') type?: string) {
    return this.studentTransactionService.findAll(type);
  }

  @Get('student/:studentId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all transactions for a specific student' })
  @ApiParam({ name: 'studentId', description: 'Student ID (UUID)', type: 'string' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by transaction type' })
  findByStudentId(@Param('studentId') studentId: string, @Query('type') type?: string) {
    return this.studentTransactionService.findByStudentId(studentId, type);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get student transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction ID (UUID)', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.studentTransactionService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update student transaction' })
  @ApiParam({ name: 'id', description: 'Transaction ID (UUID)', type: 'string' })
  update(@Param('id') id: string, @Body() updateStudentTransactionDto: UpdateStudentTransactionDto) {
    return this.studentTransactionService.update(id, updateStudentTransactionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete student transaction (soft delete)' })
  @ApiParam({ name: 'id', description: 'Transaction ID (UUID)', type: 'string' })
  remove(@Param('id') id: string) {
    return this.studentTransactionService.remove(id);
  }
}
