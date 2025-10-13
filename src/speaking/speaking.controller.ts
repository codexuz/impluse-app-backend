import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SpeakingService } from './speaking.service.js';
import { CreateSpeakingDto } from './dto/create-speaking.dto.js';
import { UpdateSpeakingDto } from './dto/update-speaking.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';

@ApiTags('speaking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('speaking')
export class SpeakingController {
  constructor(private readonly speakingService: SpeakingService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create speaking exercise' })
  @ApiResponse({ status: 201, description: 'Successfully created.' })
  create(@Body() createSpeakingDto: CreateSpeakingDto) {
    return this.speakingService.create(createSpeakingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all speaking exercises' })
  @ApiResponse({ status: 200, description: 'Return all speaking exercises.' })
  findAll() {
    return this.speakingService.findAll();
  }

  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Get speaking exercises by lesson ID' })
  @ApiResponse({ status: 200, description: 'Return all speaking exercises for the lesson with related pronunciation exercises and IELTS questions parts 1, 2, and 3.' })
  findByLesson(@Param('lessonId') lessonId: string) {
    return this.speakingService.findByLesson(lessonId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get speaking exercise by id' })
  @ApiResponse({ status: 200, description: 'Return speaking exercise with related pronunciation exercises and IELTS questions parts 1, 2, and 3.' })
  findOne(@Param('id') id: string) {
    return this.speakingService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update speaking exercise' })
  @ApiResponse({ status: 200, description: 'Successfully updated.' })
  update(@Param('id') id: string, @Body() updateSpeakingDto: UpdateSpeakingDto) {
    return this.speakingService.update(id, updateSpeakingDto);
  }

  @Get(':id/related/count')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Count all related entities (pronunciation exercises and IELTS questions)' })
  @ApiResponse({ status: 200, description: 'Return count of all related entities.' })
  countRelated(@Param('id') id: string) {
    return this.speakingService.countRelatedEntities(id);
  }

  @Delete(':id/related')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Delete all related entities (pronunciation exercises and IELTS questions) without deleting the speaking exercise' })
  @ApiResponse({ status: 200, description: 'Successfully deleted related entities.' })
  removeRelated(@Param('id') id: string) {
    return this.speakingService.deleteRelatedEntities(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Delete speaking exercise and all its related entities' })
  @ApiResponse({ status: 200, description: 'Successfully deleted speaking exercise and related entities.' })
  remove(@Param('id') id: string) {
    return this.speakingService.remove(id);
  }
}