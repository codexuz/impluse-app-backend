import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ModuleService } from './module.service.js';
import { CreateUnitDto } from './dto/create-unit.dto.js';
import { UpdateUnitDto } from './dto/update-unit.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Role } from '../roles/role.enum.js';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Units')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('units')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new unit' })
  async create(@Body() createUnitDto: CreateUnitDto) {
    return await this.moduleService.create(createUnitDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all units' })
  async findAll() {
    return await this.moduleService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get unit by id' })
  async findOne(@Param('id') id: string) {
    return await this.moduleService.findOne(id);
  }

  @Get('roadmap/:student_id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get student progress roadmap' })
  async getProgress(@Param('student_id') student_id: string) {
    return await this.moduleService.getRoadMapWithProgress(student_id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update unit by id' })
  async update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return await this.moduleService.update(id, updateUnitDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Delete unit by id' })
  async remove(@Param('id') id: string) {
    return await this.moduleService.remove(id);
  }

  @Get('course/:courseId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get units by course ID' })
  async findByCourse(@Param('courseId') courseId: string) {
    return await this.moduleService.findByCourse(courseId);
  }
}
