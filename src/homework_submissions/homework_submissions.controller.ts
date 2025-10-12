import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HomeworkSubmissionsService } from './homework_submissions.service.js';
import { CreateHomeworkSubmissionDto } from './dto/create-homework-submission.dto.js';
import { UpdateHomeworkSubmissionDto } from './dto/update-homework-submission.dto.js';
import { HomeworkSubmission } from './entities/homework_submission.entity.js';
import { HomeworkSection } from './entities/homework_sections.entity.js';
import { 
    HomeworkSubmissionResponseDto, 
    HomeworkSectionResponseDto, 
    HomeworkSubmissionWithSectionResponseDto 
} from './dto/homework-submission-response.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';

@ApiTags('Homework Submissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('homework-submissions')
export class HomeworkSubmissionsController {
    constructor(private readonly homeworkSubmissionsService: HomeworkSubmissionsService) {}

    @Post()
    @Roles(Role.STUDENT)
    @ApiOperation({ summary: 'Create a new homework submission' })
    @ApiResponse({ status: 201, description: 'The homework submission has been successfully created.', type: HomeworkSubmissionWithSectionResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async create(@Body() createHomeworkSubmissionDto: CreateHomeworkSubmissionDto): Promise<HomeworkSubmissionWithSectionResponseDto> {
        return await this.homeworkSubmissionsService.create(createHomeworkSubmissionDto);
    }

    @Post('section')
    @Roles(Role.STUDENT)
    @ApiOperation({ summary: 'Save homework submission by section (creates new or updates existing)' })
    @ApiResponse({ status: 201, description: 'The homework submission has been successfully saved.', type: HomeworkSubmissionWithSectionResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async saveBySection(@Body() createHomeworkSubmissionDto: CreateHomeworkSubmissionDto): Promise<HomeworkSubmissionWithSectionResponseDto> {
        return await this.homeworkSubmissionsService.saveBySection(createHomeworkSubmissionDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Get all homework submissions' })
    @ApiResponse({ status: 200, description: 'Return all homework submissions.', type: [HomeworkSubmissionResponseDto] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findAll(): Promise<HomeworkSubmission[]> {
        return await this.homeworkSubmissionsService.findAll();
    }

    @Get('homework/:homeworkId')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Get all submissions for a specific homework' })
    @ApiResponse({ status: 200, description: 'Return all submissions for the homework.', type: [HomeworkSubmission] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findByHomework(@Param('homeworkId') homeworkId: string): Promise<HomeworkSubmission[]> {
        return await this.homeworkSubmissionsService.findByHomeworkId(homeworkId);
    }

    @Get('student/:studentId')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get all submissions by a specific student' })
    @ApiResponse({ status: 200, description: 'Return all submissions by the student.', type: [HomeworkSubmission] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findByStudent(@Param('studentId') studentId: string): Promise<HomeworkSubmission[]> {
        return await this.homeworkSubmissionsService.findByStudentId(studentId);
    }

    @Get('student/:studentId/homework/:homeworkId')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get a specific submission by student and homework' })
    @ApiResponse({ status: 200, description: 'Return the submission.', type: HomeworkSubmission })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Submission not found.' })
    async findByStudentAndHomework(
        @Param('studentId') studentId: string,
        @Param('homeworkId') homeworkId: string
    ): Promise<HomeworkSubmission> {
        return await this.homeworkSubmissionsService.findByStudentAndHomework(studentId, homeworkId);
    }

    @Get('section/:section')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Get all submissions by section' })
    @ApiResponse({ status: 200, description: 'Return all submissions for the specified section.', type: [HomeworkSectionResponseDto] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findBySection(@Param('section') section: string): Promise<HomeworkSection[]> {
        return await this.homeworkSubmissionsService.findBySection(section);
    }

    @Get('student/:studentId/section/:section')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get all submissions by student and section' })
    @ApiResponse({ status: 200, description: 'Return all submissions by the student for the specified section.', type: [HomeworkSectionResponseDto] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findByStudentAndSection(
        @Param('studentId') studentId: string,
        @Param('section') section: string
    ): Promise<HomeworkSection[]> {
        return await this.homeworkSubmissionsService.findByStudentAndSection(studentId, section);
    }

    @Get('homework/:homeworkId/section/:section')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Get all submissions by homework and section' })
    @ApiResponse({ status: 200, description: 'Return all submissions for the homework and section.', type: [HomeworkSectionResponseDto] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findByHomeworkAndSection(
        @Param('homeworkId') homeworkId: string,
        @Param('section') section: string
    ): Promise<HomeworkSection[]> {
        return await this.homeworkSubmissionsService.findByHomeworkAndSection(homeworkId, section);
    }

    @Get('student/:studentId/homework/:homeworkId/section/:section')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get specific submission by student, homework, and section' })
    @ApiResponse({ status: 200, description: 'Return the submission.', type: HomeworkSectionResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Submission not found.' })
    async findByStudentHomeworkAndSection(
        @Param('studentId') studentId: string,
        @Param('homeworkId') homeworkId: string,
        @Param('section') section: string
    ): Promise<HomeworkSection> {
        return await this.homeworkSubmissionsService.findByStudentHomeworkAndSection(studentId, homeworkId, section);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get a homework submission by id' })
    @ApiResponse({ status: 200, description: 'Return the homework submission.', type: HomeworkSubmission })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Submission not found.' })
    async findOne(@Param('id') id: string): Promise<HomeworkSubmission> {
        return await this.homeworkSubmissionsService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.STUDENT)
    @ApiOperation({ summary: 'Update a homework submission' })
    @ApiResponse({ status: 200, description: 'The submission has been successfully updated.', type: HomeworkSubmission })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Submission not found.' })
    async update(
        @Param('id') id: string,
        @Body() updateHomeworkSubmissionDto: UpdateHomeworkSubmissionDto
    ): Promise<HomeworkSubmission> {
        return await this.homeworkSubmissionsService.update(id, updateHomeworkSubmissionDto);
    }

    @Patch(':id/feedback')
    @Roles(Role.TEACHER)
    @ApiOperation({ summary: 'Add/Update feedback for a homework submission' })
    @ApiResponse({ status: 200, description: 'The feedback has been successfully updated.', type: HomeworkSubmission })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Submission not found.' })
    async updateFeedback(
        @Param('id') id: string,
        @Body('feedback') feedback: string
    ): Promise<HomeworkSubmission> {
        return await this.homeworkSubmissionsService.updateFeedback(id, feedback);
    }

    @Patch(':id/status')
    @Roles(Role.TEACHER)
    @ApiOperation({ summary: 'Update the status of a homework submission' })
    @ApiResponse({ status: 200, description: 'The status has been successfully updated.', type: HomeworkSubmission })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Submission not found.' })
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: string
    ): Promise<HomeworkSubmission> {
        return await this.homeworkSubmissionsService.updateStatus(id, status);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a homework submission' })
    @ApiResponse({ status: 200, description: 'The submission has been successfully deleted.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Submission not found.' })
    async remove(@Param('id') id: string): Promise<void> {
        return await this.homeworkSubmissionsService.remove(id);
    }

    @Get('student/:studentId/homework/:homeworkId/exercises')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get exercises with scores by student ID and homework ID' })
    @ApiResponse({ status: 200, description: 'Return exercises with scores and completion status.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async getExercisesWithScores(
        @Param('studentId') studentId: string,
        @Param('homeworkId') homeworkId: string
    ): Promise<any[]> {
        return await this.homeworkSubmissionsService.getExercisesWithScoresByStudentAndHomework(studentId, homeworkId);
    }

    @Get('student/:studentId/stats')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ 
        summary: 'Get student\'s homework statistics average by section type over time',
        description: 'If startDate and endDate query parameters are not provided, defaults to the last month of data'
    })
    @ApiResponse({ status: 200, description: 'Return homework statistics with averages by section.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async getStudentHomeworkStats(
        @Param('studentId') studentId: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ): Promise<any> {
        return await this.homeworkSubmissionsService.getStudentHomeworkStatsBySection(studentId, startDate, endDate);
    }
}
