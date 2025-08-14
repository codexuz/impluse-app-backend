import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentBookService } from './student-book.service.js';
import { CreateStudentBookDto } from './dto/create-student-book.dto.js';
import { UpdateStudentBookDto } from './dto/update-student-book.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@ApiTags('student-books')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('student-books')
export class StudentBookController {
  constructor(private readonly studentBookService: StudentBookService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create student book' })
  @ApiResponse({ status: 201, description: 'Successfully created.' })
  create(@Body() createStudentBookDto: CreateStudentBookDto) {
    return this.studentBookService.create(createStudentBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all student books' })
  @ApiResponse({ status: 200, description: 'Return all student books.' })
  findAll() {
    return this.studentBookService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student book by id' })
  @ApiResponse({ status: 200, description: 'Return student book.' })
  findOne(@Param('id') id: string) {
    return this.studentBookService.findOne(id);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get books by student ID (based on their level)' })
  @ApiResponse({ status: 200, description: 'Return books available to the student.' })
  findByStudentId(@Param('studentId') studentId: string) {
    return this.studentBookService.findByStudentId(studentId);
  }

  @Get('student/:studentId/level/:levelId')
  @ApiOperation({ summary: 'Get books by student ID and specific level' })
  @ApiResponse({ status: 200, description: 'Return books for the specified level.' })
  @ApiResponse({ status: 404, description: 'Student not found or not assigned to level.' })
  findByStudentAndLevel(
    @Param('studentId') studentId: string,
    @Param('levelId') levelId: string
  ) {
    return this.studentBookService.findByStudentAndLevel(studentId, levelId);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update student book' })
  @ApiResponse({ status: 200, description: 'Successfully updated.' })
  update(@Param('id') id: string, @Body() updateStudentBookDto: UpdateStudentBookDto) {
    return this.studentBookService.update(id, updateStudentBookDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete student book' })
  @ApiResponse({ status: 200, description: 'Successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.studentBookService.remove(id);
  }
}