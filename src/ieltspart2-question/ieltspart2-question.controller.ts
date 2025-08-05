import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Ieltspart2QuestionService } from './ieltspart2-question.service.js';
import { CreateIeltspart2QuestionDto } from './dto/create-ieltspart2-question.dto.js';
import { UpdateIeltspart2QuestionDto } from './dto/update-ieltspart2-question.dto.js';
import { Ieltspart2Question } from './entities/ieltspart2-question.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';

@ApiTags('IELTS Part 2 Questions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ieltspart2-question')
export class Ieltspart2QuestionController {
    constructor(private readonly ieltspart2QuestionService: Ieltspart2QuestionService) {}

    @Post()
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Create a new IELTS Part 2 question' })
    @ApiResponse({ status: 201, description: 'The question has been successfully created.', type: Ieltspart2Question })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async create(@Body() createIeltspart2QuestionDto: CreateIeltspart2QuestionDto): Promise<Ieltspart2Question> {
        return await this.ieltspart2QuestionService.create(createIeltspart2QuestionDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Get all IELTS Part 2 questions' })
    @ApiResponse({ status: 200, description: 'Return all IELTS Part 2 questions.', type: [Ieltspart2Question] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findAll(): Promise<Ieltspart2Question[]> {
        return await this.ieltspart2QuestionService.findAll();
    }

    @Get('speaking/:speakingId')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get all questions for a specific speaking test' })
    @ApiResponse({ status: 200, description: 'Return all questions for the speaking test.', type: [Ieltspart2Question] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findBySpeaking(@Param('speakingId') speakingId: string): Promise<Ieltspart2Question[]> {
        return await this.ieltspart2QuestionService.findBySpeakingId(speakingId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get a specific IELTS Part 2 question' })
    @ApiResponse({ status: 200, description: 'Return the IELTS Part 2 question.', type: Ieltspart2Question })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Question not found.' })
    async findOne(@Param('id') id: string): Promise<Ieltspart2Question> {
        return await this.ieltspart2QuestionService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Update an IELTS Part 2 question' })
    @ApiResponse({ status: 200, description: 'The question has been successfully updated.', type: Ieltspart2Question })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Question not found.' })
    async update(
        @Param('id') id: string,
        @Body() updateIeltspart2QuestionDto: UpdateIeltspart2QuestionDto
    ): Promise<Ieltspart2Question> {
        return await this.ieltspart2QuestionService.update(id, updateIeltspart2QuestionDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete an IELTS Part 2 question' })
    @ApiResponse({ status: 200, description: 'The question has been successfully deleted.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Question not found.' })
    async remove(@Param('id') id: string): Promise<void> {
        return await this.ieltspart2QuestionService.remove(id);
    }
}
