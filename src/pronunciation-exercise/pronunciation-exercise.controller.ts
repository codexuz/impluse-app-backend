import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { PronunciationExerciseService } from './pronunciation-exercise.service.js';
import { CreatePronunciationExerciseDto } from './dto/create-pronunciation-exercise.dto.js';
import { UpdatePronunciationExerciseDto } from './dto/update-pronunciation-exercise.dto.js';
import { PronunciationExercise } from './entities/pronunciation-exercise.entity.js';

@ApiTags('pronunciation-exercise')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pronunciation-exercise')
export class PronunciationExerciseController {
  constructor(private readonly pronunciationExerciseService: PronunciationExerciseService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new pronunciation exercise' })
  @ApiResponse({ 
    status: 201, 
    description: 'The pronunciation exercise has been successfully created.',
    type: PronunciationExercise
  })
  create(@Body() createPronunciationExerciseDto: CreatePronunciationExerciseDto) {
    return this.pronunciationExerciseService.create(createPronunciationExerciseDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all pronunciation exercises' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all pronunciation exercises',
    type: [PronunciationExercise]
  })
  findAll() {
    return this.pronunciationExerciseService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get a specific pronunciation exercise by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the pronunciation exercise',
    type: PronunciationExercise
  })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  findOne(@Param('id') id: string) {
    return this.pronunciationExerciseService.findOne(id);
  }

  @Get('speaking/:speaking_id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all pronunciation exercises for a speaking exercise' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all pronunciation exercises for the specified speaking exercise',
    type: [PronunciationExercise]
  })
  findBySpeakingId(@Param('speaking_id') speaking_id: string) {
    return this.pronunciationExerciseService.findBySpeakingId(speaking_id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update a pronunciation exercise' })
  @ApiResponse({ 
    status: 200, 
    description: 'The pronunciation exercise has been successfully updated.',
    type: PronunciationExercise
  })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  update(@Param('id') id: string, @Body() updatePronunciationExerciseDto: UpdatePronunciationExerciseDto) {
    return this.pronunciationExerciseService.update(id, updatePronunciationExerciseDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a pronunciation exercise' })
  @ApiResponse({ status: 200, description: 'The pronunciation exercise has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  remove(@Param('id') id: string) {
    return this.pronunciationExerciseService.remove(id);
  }
}
