import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { WritingService } from './writing.service.js';
import { CreateWritingDto } from './dto/create-writing.dto.js';
import { UpdateWritingDto } from './dto/update-writing.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Writing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('writing')
export class WritingController {
  constructor(private readonly writingService: WritingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new writing exercise' })
  async create(@Body() createWritingDto: CreateWritingDto) {
    return await this.writingService.create(createWritingDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all writing exercises' })
  async findAll() {
    return await this.writingService.findAll();
  }

  @Get('lesson/:lessonId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get writing exercises by lesson id' })
  async findByLessonId(@Param('lessonId') lessonId: string) {
    return await this.writingService.findByLessonId(lessonId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get writing exercise by id' })
  async findOne(@Param('id') id: string) {
    return await this.writingService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update writing exercise' })
  async update(@Param('id') id: string, @Body() updateWritingDto: UpdateWritingDto) {
    return await this.writingService.update(id, updateWritingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete writing exercise' })
  async remove(@Param('id') id: string) {
    return await this.writingService.remove(id);
  }
}
