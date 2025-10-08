import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GroupAssignedLessonsService } from './group_assigned_lessons.service.js';
import { CreateGroupAssignedLessonDto } from './dto/create-group_assigned_lesson.dto.js';
import { UpdateGroupAssignedLessonDto } from './dto/update-group_assigned_lesson.dto.js';
import { GroupAssignedLesson } from './entities/group_assigned_lesson.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';

@ApiTags('Group Assigned Lessons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('group-assigned-lessons')
export class GroupAssignedLessonsController {
    constructor(private readonly groupAssignedLessonsService: GroupAssignedLessonsService) {}

    @Post()
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Create a new lesson assignment for a group' })
    @ApiResponse({ status: 201, description: 'The lesson has been successfully assigned to the group.', type: GroupAssignedLesson })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async create(@Body() createGroupAssignedLessonDto: CreateGroupAssignedLessonDto): Promise<GroupAssignedLesson> {
        return await this.groupAssignedLessonsService.create(createGroupAssignedLessonDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Get all assigned lessons' })
    @ApiResponse({ status: 200, description: 'Return all assigned lessons.', type: [GroupAssignedLesson] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findAll(): Promise<GroupAssignedLesson[]> {
        return await this.groupAssignedLessonsService.findAll();
    }

    @Get('group/:groupId')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get all assigned lessons for a specific group' })
    @ApiResponse({ status: 200, description: 'Return all lessons assigned to the group.', type: [GroupAssignedLesson] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findByGroupId(@Param('groupId') groupId: string): Promise<GroupAssignedLesson[]> {
        return await this.groupAssignedLessonsService.findByGroupId(groupId);
    }

    @Get('unit/:unitId')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get all assigned lessons for a specific unit' })
    @ApiResponse({ status: 200, description: 'Return all lessons assigned to the unit.', type: [GroupAssignedLesson] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findByUnitId(@Param('unitId') unitId: string): Promise<GroupAssignedLesson[]> {
        return await this.groupAssignedLessonsService.findByUnitId(unitId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get an assigned lesson by id' })
    @ApiResponse({ status: 200, description: 'Return the assigned lesson.', type: GroupAssignedLesson })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Assigned lesson not found.' })
    async findOne(@Param('id') id: string): Promise<GroupAssignedLesson> {
        return await this.groupAssignedLessonsService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Update an assigned lesson' })
    @ApiResponse({ status: 200, description: 'The assigned lesson has been successfully updated.', type: GroupAssignedLesson })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Assigned lesson not found.' })
    async update(
        @Param('id') id: string,
        @Body() updateGroupAssignedLessonDto: UpdateGroupAssignedLessonDto
    ): Promise<GroupAssignedLesson> {
        return await this.groupAssignedLessonsService.update(id, updateGroupAssignedLessonDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Delete an assigned lesson' })
    @ApiResponse({ status: 200, description: 'The assigned lesson has been successfully deleted.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Assigned lesson not found.' })
    async remove(@Param('id') id: string): Promise<void> {
        return await this.groupAssignedLessonsService.remove(id);
    }
}

