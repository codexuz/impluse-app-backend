import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { TeacherTransactionService } from './teacher-transaction.service.js';
import { CreateTeacherTransactionDto } from './dto/create-teacher-transaction.dto.js';
import { UpdateTeacherTransactionDto } from './dto/update-teacher-transaction.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Teacher Transaction')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teacher-transaction')
export class TeacherTransactionController {
  constructor(private readonly teacherTransactionService: TeacherTransactionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new teacher transaction' })
  create(@Body() createTeacherTransactionDto: CreateTeacherTransactionDto) {
    return this.teacherTransactionService.create(createTeacherTransactionDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all teacher transactions' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by transaction type' })
  findAll(@Query('type') type?: string) {
    return this.teacherTransactionService.findAll(type);
  }

  @Get('teacher/:teacherId')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all transactions for a specific teacher' })
  @ApiParam({ name: 'teacherId', description: 'Teacher ID (UUID)', type: 'string' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by transaction type' })
  findByTeacherId(@Param('teacherId') teacherId: string, @Query('type') type?: string) {
    return this.teacherTransactionService.findByTeacherId(teacherId, type);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get teacher transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction ID (UUID)', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.teacherTransactionService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update teacher transaction' })
  @ApiParam({ name: 'id', description: 'Transaction ID (UUID)', type: 'string' })
  update(@Param('id') id: string, @Body() updateTeacherTransactionDto: UpdateTeacherTransactionDto) {
    return this.teacherTransactionService.update(id, updateTeacherTransactionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete teacher transaction (soft delete)' })
  @ApiParam({ name: 'id', description: 'Transaction ID (UUID)', type: 'string' })
  remove(@Param('id') id: string) {
    return this.teacherTransactionService.remove(id);
  }
}
