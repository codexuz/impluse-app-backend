import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GroupHomeworksService } from './group_homeworks.service.js';
import { CreateGroupHomeworkDto } from './dto/create-group-homework.dto.js';
import { UpdateGroupHomeworkDto } from './dto/update-group_homework.dto.js';
import { GroupHomework } from './entities/group_homework.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';

@ApiTags('Group Homeworks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('group-homeworks')
export class GroupHomeworksController {
    constructor(private readonly groupHomeworksService: GroupHomeworksService) {}

    @Post()
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Create a new homework assignment for a group' })
    @ApiResponse({ status: 201, description: 'The homework has been successfully created.', type: GroupHomework })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async create(@Body() createGroupHomeworkDto: CreateGroupHomeworkDto): Promise<GroupHomework> {
        return await this.groupHomeworksService.create(createGroupHomeworkDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Get all homework assignments' })
    @ApiResponse({ status: 200, description: 'Return all homework assignments.', type: [GroupHomework] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findAll(): Promise<GroupHomework[]> {
        return await this.groupHomeworksService.findAll();
    }

    @Get('group/:groupId')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.STUDENT)
    @ApiOperation({ summary: 'Get all homework assignments for a specific group' })
    @ApiResponse({ status: 200, description: 'Return all homeworks assigned to the group.', type: [GroupHomework] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findByGroupId(@Param('groupId') groupId: string): Promise<GroupHomework[]> {
        return await this.groupHomeworksService.findByGroupId(groupId);
    }

    @Get('teacher/:teacherId')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Get all homework assignments by a specific teacher' })
    @ApiResponse({ status: 200, description: 'Return all homeworks assigned by the teacher.', type: [GroupHomework] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findByTeacherId(@Param('teacherId') teacherId: string): Promise<GroupHomework[]> {
        return await this.groupHomeworksService.findByTeacherId(teacherId);
    }

    @Get('lesson/:lessonId')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get all homework assignments for a specific lesson' })
    @ApiResponse({ status: 200, description: 'Return all homeworks for the lesson.', type: [GroupHomework] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findByLessonId(@Param('lessonId') lessonId: string): Promise<GroupHomework[]> {
        return await this.groupHomeworksService.findByLessonId(lessonId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get a homework assignment by id' })
    @ApiResponse({ status: 200, description: 'Return the homework assignment.', type: GroupHomework })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Homework not found.' })
    async findOne(@Param('id') id: string): Promise<GroupHomework> {
        return await this.groupHomeworksService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Update a homework assignment' })
    @ApiResponse({ status: 200, description: 'The homework has been successfully updated.', type: GroupHomework })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Homework not found.' })
    async update(
        @Param('id') id: string,
        @Body() updateGroupHomeworkDto: UpdateGroupHomeworkDto
    ): Promise<GroupHomework> {
        return await this.groupHomeworksService.update(id, updateGroupHomeworkDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a homework assignment' })
    @ApiResponse({ status: 200, description: 'The homework has been successfully deleted.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Homework not found.' })
    async remove(@Param('id') id: string): Promise<void> {
        return await this.groupHomeworksService.remove(id);
    }

    @Get('user/:userId')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get all homework assignments for a specific user' })
    @ApiResponse({ status: 200, description: 'Return all homeworks for the user\'s group.', type: [GroupHomework] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'User is not in any group.' })
    async getHomeworksForUser(@Param('userId') userId: string): Promise<GroupHomework[]> {
        return await this.groupHomeworksService.getHomeworksForUser(userId);
    }

    @Get('active/:userId')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get active homework assignments for a specific user for the current date' })
    @ApiResponse({ status: 200, description: 'Return active homeworks for the user\'s group.', type: [GroupHomework] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'User is not in any group.' })
    async getActiveHomeworksByDate(@Param('userId') userId: string): Promise<GroupHomework[]> {
        return await this.groupHomeworksService.getActiveHomeworksByDate(userId);
    }
    
    @Get('active/:userId/:date')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get active homework assignments for a specific user for a specific date' })
    @ApiResponse({ status: 200, description: 'Return active homeworks for the user\'s group on a specific date.', type: [GroupHomework] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'User is not in any group.' })
    async getActiveHomeworksBySpecificDate(
        @Param('userId') userId: string,
        @Param('date') dateString: string
    ): Promise<GroupHomework[]> {
        const date = new Date(dateString);
        return await this.groupHomeworksService.getActiveHomeworksByDate(userId, date);
    }
    
    @Get('content/:homeworkId')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get homework with detailed lesson content including exercises and speaking activities' })
    @ApiResponse({ status: 200, description: 'Return homework with lesson, exercises, and speaking content.', type: GroupHomework })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Homework not found.' })
    async getHomeworkWithLessonContent(@Param('homeworkId') homeworkId: string): Promise<GroupHomework> {
        return await this.groupHomeworksService.getHomeworkWithLessonContent(homeworkId);
    }
}
