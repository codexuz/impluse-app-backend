import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SpeakingResponseService } from './speaking-response.service.js';
import { CreateSpeakingResponseDto } from './dto/create-speaking-response.dto.js';
import { UpdateSpeakingResponseDto } from './dto/update-speaking-response.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { SpeakingResponse } from './entities/speaking-response.entity.js';

@ApiTags('speaking-responses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('speaking-responses')
export class SpeakingResponseController {
  constructor(private readonly speakingResponseService: SpeakingResponseService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new speaking response',
    description: 'Create a new speaking response with one or more audio URLs'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'The speaking response has been successfully created.',
    type: SpeakingResponse 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() createSpeakingResponseDto: CreateSpeakingResponseDto): Promise<SpeakingResponse> {
    return this.speakingResponseService.create(createSpeakingResponseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all speaking responses' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all speaking responses',
    type: [SpeakingResponse] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(): Promise<SpeakingResponse[]> {
    return this.speakingResponseService.findAll();
  }

  @Get('speaking/:speakingId')
  @ApiOperation({ summary: 'Get all speaking responses for a specific speaking ID' })
  @ApiParam({ name: 'speakingId', description: 'The speaking ID to filter by' })
  @ApiResponse({
    status: 200,
    description: 'Returns all speaking responses for the specified speaking ID',
    type: [SpeakingResponse]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findBySpeakingId(@Param('speakingId') speakingId: string): Promise<SpeakingResponse[]> {
    return this.speakingResponseService.findBySpeakingId(speakingId);
  }

  @Get('type/:responseType')
  @ApiOperation({ summary: 'Get all speaking responses of a specific type' })
  @ApiParam({ name: 'responseType', description: 'The response type to filter by' })
  @ApiResponse({
    status: 200,
    description: 'Returns all speaking responses of the specified type',
    type: [SpeakingResponse]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findByType(@Param('responseType') responseType: string): Promise<SpeakingResponse[]> {
    return this.speakingResponseService.findByType(responseType);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get all speaking responses for a specific student' })
  @ApiParam({ name: 'studentId', description: 'The student ID to filter by' })
  @ApiResponse({
    status: 200,
    description: 'Returns all speaking responses for the specified student',
    type: [SpeakingResponse]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findByStudentId(@Param('studentId') studentId: string): Promise<SpeakingResponse[]> {
    return this.speakingResponseService.findByStudentId(studentId);
  }

  @Get('check-submission')
  @ApiOperation({ summary: 'Get exercise details with completion status for a lesson' })
  @ApiQuery({ name: 'lessonId', description: 'The lesson ID to check', required: true })
  @ApiQuery({ name: 'studentId', description: 'The student ID to check', required: true })
  @ApiResponse({
    status: 200,
    description: 'Returns exercise details with completion status for the lesson',
    type: Array<any>
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async checkSubmission(
    @Query('lessonId') lessonId: string,
    @Query('studentId') studentId: string
  ): Promise<any[]> {
    return this.speakingResponseService.checkSubmission(lessonId, studentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a speaking response by ID' })
  @ApiParam({ name: 'id', description: 'The speaking response ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the speaking response',
    type: SpeakingResponse
  })
  @ApiResponse({ status: 404, description: 'Speaking response not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findOne(@Param('id') id: string): Promise<SpeakingResponse> {
    return this.speakingResponseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a speaking response' })
  @ApiParam({ name: 'id', description: 'The speaking response ID to update' })
  @ApiResponse({
    status: 200,
    description: 'The speaking response has been successfully updated.',
    type: SpeakingResponse
  })
  @ApiResponse({ status: 404, description: 'Speaking response not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async update(
    @Param('id') id: string, 
    @Body() updateSpeakingResponseDto: UpdateSpeakingResponseDto
  ): Promise<SpeakingResponse> {
    return this.speakingResponseService.update(id, updateSpeakingResponseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a speaking response' })
  @ApiParam({ name: 'id', description: 'The speaking response ID to delete' })
  @ApiResponse({ status: 200, description: 'The speaking response has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Speaking response not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.speakingResponseService.remove(id);
  }
}