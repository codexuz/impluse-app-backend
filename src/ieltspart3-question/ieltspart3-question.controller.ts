import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Ieltspart3QuestionService } from './ieltspart3-question.service.js';
import { CreateIeltspart3QuestionDto } from './dto/create-ieltspart3-question.dto.js';
import { UpdateIeltspart3QuestionDto } from './dto/update-ieltspart3-question.dto.js';
import { Ieltspart3Question } from './entities/ieltspart3-question.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';

@ApiTags('IELTS Part 3 Questions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ieltspart3-question')
export class Ieltspart3QuestionController {
    constructor(private readonly ieltspart3QuestionService: Ieltspart3QuestionService) {}

    @Post()
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Create a new IELTS Part 3 question' })
    @ApiResponse({ status: 201, description: 'The question has been successfully created.', type: Ieltspart3Question })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async create(@Body() createIeltspart3QuestionDto: CreateIeltspart3QuestionDto): Promise<Ieltspart3Question> {
        return await this.ieltspart3QuestionService.create(createIeltspart3QuestionDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Get all IELTS Part 3 questions' })
    @ApiResponse({ status: 200, description: 'Return all IELTS Part 3 questions.', type: [Ieltspart3Question] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findAll(): Promise<Ieltspart3Question[]> {
        return await this.ieltspart3QuestionService.findAll();
    }

    @Get('speaking/:speakingId')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get all questions for a specific speaking test' })
    @ApiResponse({ status: 200, description: 'Return all questions for the speaking test.', type: [Ieltspart3Question] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findBySpeaking(@Param('speakingId') speakingId: string): Promise<Ieltspart3Question[]> {
        return await this.ieltspart3QuestionService.findBySpeakingId(speakingId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get a specific IELTS Part 3 question' })
    @ApiResponse({ status: 200, description: 'Return the IELTS Part 3 question.', type: Ieltspart3Question })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Question not found.' })
    async findOne(@Param('id') id: string): Promise<Ieltspart3Question> {
        return await this.ieltspart3QuestionService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Update an IELTS Part 3 question' })
    @ApiResponse({ status: 200, description: 'The question has been successfully updated.', type: Ieltspart3Question })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Question not found.' })
    async update(
        @Param('id') id: string,
        @Body() updateIeltspart3QuestionDto: UpdateIeltspart3QuestionDto
    ): Promise<Ieltspart3Question> {
        return await this.ieltspart3QuestionService.update(id, updateIeltspart3QuestionDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete an IELTS Part 3 question' })
    @ApiResponse({ status: 200, description: 'The question has been successfully deleted.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Question not found.' })
    async remove(@Param('id') id: string): Promise<void> {
        return await this.ieltspart3QuestionService.remove(id);
    }
}
