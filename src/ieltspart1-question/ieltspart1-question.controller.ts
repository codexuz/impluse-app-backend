import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Ieltspart1QuestionService } from './ieltspart1-question.service.js';
import { CreateIeltspart1QuestionDto } from './dto/create-ieltspart1-question.dto.js';
import { UpdateIeltspart1QuestionDto } from './dto/update-ieltspart1-question.dto.js';
import { Ieltspart1Question } from './entities/ieltspart1-question.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';

@ApiTags('IELTS Part 1 Questions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ieltspart1-question')
export class Ieltspart1QuestionController {
    constructor(private readonly ieltspart1QuestionService: Ieltspart1QuestionService) {}

    @Post()
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Create a new IELTS Part 1 question' })
    @ApiResponse({ status: 201, description: 'The question has been successfully created.', type: Ieltspart1Question })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async create(@Body() createIeltspart1QuestionDto: CreateIeltspart1QuestionDto): Promise<Ieltspart1Question> {
        return await this.ieltspart1QuestionService.create(createIeltspart1QuestionDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Get all IELTS Part 1 questions' })
    @ApiResponse({ status: 200, description: 'Return all IELTS Part 1 questions.', type: [Ieltspart1Question] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findAll(): Promise<Ieltspart1Question[]> {
        return await this.ieltspart1QuestionService.findAll();
    }

    @Get('speaking/:speakingId')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get all questions for a specific speaking test' })
    @ApiResponse({ status: 200, description: 'Return all questions for the speaking test.', type: [Ieltspart1Question] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findBySpeaking(@Param('speakingId') speakingId: string): Promise<Ieltspart1Question[]> {
        return await this.ieltspart1QuestionService.findBySpeakingId(speakingId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get a specific IELTS Part 1 question' })
    @ApiResponse({ status: 200, description: 'Return the IELTS Part 1 question.', type: Ieltspart1Question })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Question not found.' })
    async findOne(@Param('id') id: string): Promise<Ieltspart1Question> {
        return await this.ieltspart1QuestionService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Update an IELTS Part 1 question' })
    @ApiResponse({ status: 200, description: 'The question has been successfully updated.', type: Ieltspart1Question })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Question not found.' })
    async update(
        @Param('id') id: string,
        @Body() updateIeltspart1QuestionDto: UpdateIeltspart1QuestionDto
    ): Promise<Ieltspart1Question> {
        return await this.ieltspart1QuestionService.update(id, updateIeltspart1QuestionDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete an IELTS Part 1 question' })
    @ApiResponse({ status: 200, description: 'The question has been successfully deleted.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Question not found.' })
    async remove(@Param('id') id: string): Promise<void> {
        return await this.ieltspart1QuestionService.remove(id);
    }
}
