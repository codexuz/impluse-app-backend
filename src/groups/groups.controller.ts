import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GroupsService } from './groups.service.js';
import { CreateGroupDto } from './dto/create-group.dto.js';
import { UpdateGroupDto } from './dto/update-group.dto.js';
import { Group } from './entities/group.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';

@ApiTags('Groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    @Post()
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Create a new group' })
    @ApiResponse({ status: 201, description: 'The group has been successfully created.', type: Group })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
        return await this.groupsService.create(createGroupDto);
    }

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get all groups' })
    @ApiResponse({ status: 200, description: 'Return all groups.', type: [Group] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findAll(): Promise<Group[]> {
        return await this.groupsService.findAll();
    }

    @Get('group-count')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Get count of all active groups' })
    @ApiResponse({ status: 200, description: 'Return the count of active groups.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async getActiveGroupsCount(): Promise<{ count: number }> {
        const count = await this.groupsService.countActiveGroups();
        return { count };
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get a group by id' })
    @ApiResponse({ status: 200, description: 'Return the group.', type: Group })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Group not found.' })
    async findOne(@Param('id') id: string): Promise<Group> {
        return await this.groupsService.findOne(id);
    }

    @Get(':id/students')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Get all students in a group' })
    @ApiResponse({ status: 200, description: 'Return the group with its students.', type: Group })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Group not found.' })
    async findStudents(@Param('id') id: string): Promise<Group> {
        return await this.groupsService.findAllStudentsInGroup(id);
    }

    @Get(':id/teacher')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get the teacher of a group' })
    @ApiResponse({ status: 200, description: 'Return the group with its teacher.', type: Group })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Group not found.' })
    async findTeacher(@Param('id') id: string): Promise<Group> {
        return await this.groupsService.findTeacherOfGroup(id);
    }

    @Get('teacher/:teacherId')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Get all groups for a teacher' })
    @ApiResponse({ status: 200, description: 'Return all groups for the teacher.', type: [Group] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findByTeacher(@Param('teacherId') teacherId: string): Promise<Group[]> {
        return await this.groupsService.findByTeacherId(teacherId);
    }

    @Get('level/:levelId')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Get all groups for a level' })
    @ApiResponse({ status: 200, description: 'Return all groups for the level.', type: [Group] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findByLevel(@Param('levelId') levelId: string): Promise<Group[]> {
        return await this.groupsService.findByLevelId(levelId);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Update a group' })
    @ApiResponse({ status: 200, description: 'The group has been successfully updated.', type: Group })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Group not found.' })
    async update(
        @Param('id') id: string,
        @Body() updateGroupDto: UpdateGroupDto
    ): Promise<Group> {
        return await this.groupsService.update(id, updateGroupDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a group' })
    @ApiResponse({ status: 200, description: 'The group has been successfully deleted.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Group not found.' })
    async remove(@Param('id') id: string): Promise<void> {
        return await this.groupsService.remove(id);
    }
}
