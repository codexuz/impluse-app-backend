import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StudentBookUnitsService } from './student-book-units.service.js';
import { CreateStudentBookUnitDto } from './dto/create-student-book-unit.dto.js';
import { UpdateStudentBookUnitDto } from './dto/update-student-book-unit.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';

@ApiTags('student-book-units')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('student-book-units')
export class StudentBookUnitsController {
  constructor(private readonly studentBookUnitsService: StudentBookUnitsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new student book unit' })
  @ApiResponse({ status: 201, description: 'Unit created successfully' })
  create(@Body() createStudentBookUnitDto: CreateStudentBookUnitDto) {
    return this.studentBookUnitsService.create(createStudentBookUnitDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all student book units' })
  @ApiResponse({ status: 200, description: 'Return all units' })
  findAll() {
    return this.studentBookUnitsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student book unit by id' })
  @ApiResponse({ status: 200, description: 'Return the unit' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  findOne(@Param('id') id: string) {
    return this.studentBookUnitsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update a student book unit' })
  @ApiResponse({ status: 200, description: 'Unit updated successfully' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  update(
    @Param('id') id: string,
    @Body() updateStudentBookUnitDto: UpdateStudentBookUnitDto,
  ) {
    return this.studentBookUnitsService.update(id, updateStudentBookUnitDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a student book unit' })
  @ApiResponse({ status: 200, description: 'Unit deleted successfully' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  remove(@Param('id') id: string) {
    return this.studentBookUnitsService.remove(id);
  }
}