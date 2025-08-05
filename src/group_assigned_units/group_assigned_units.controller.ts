import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GroupAssignedUnitsService } from './group_assigned_units.service.js';
import { CreateGroupAssignedUnitDto } from './dto/create-group_assigned_unit.dto.js';
import { UpdateGroupAssignedUnitDto } from './dto/update-group_assigned_unit.dto.js';
import { GroupAssignedUnit } from './entities/group_assigned_unit.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/constants/roles.js';

@ApiTags('Group Assigned Units')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('group-assigned-units')
export class GroupAssignedUnitsController {
    constructor(private readonly groupAssignedUnitsService: GroupAssignedUnitsService) {}

    @Post()
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Create a new unit assignment for a group' })
    @ApiResponse({ status: 201, description: 'The unit has been successfully assigned to the group.', type: GroupAssignedUnit })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async create(@Body() createGroupAssignedUnitDto: CreateGroupAssignedUnitDto): Promise<GroupAssignedUnit> {
        return await this.groupAssignedUnitsService.create(createGroupAssignedUnitDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Get all assigned units' })
    @ApiResponse({ status: 200, description: 'Return all assigned units.', type: [GroupAssignedUnit] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findAll(): Promise<GroupAssignedUnit[]> {
        return await this.groupAssignedUnitsService.findAll();
    }

    @Get('group/:groupId')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get all assigned units for a specific group' })
    @ApiResponse({ status: 200, description: 'Return all units assigned to the group.', type: [GroupAssignedUnit] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findByGroupId(@Param('groupId') groupId: string): Promise<GroupAssignedUnit[]> {
        return await this.groupAssignedUnitsService.findByGroupId(groupId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @ApiOperation({ summary: 'Get an assigned unit by id' })
    @ApiResponse({ status: 200, description: 'Return the assigned unit.', type: GroupAssignedUnit })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Assigned unit not found.' })
    async findOne(@Param('id') id: string): Promise<GroupAssignedUnit> {
        return await this.groupAssignedUnitsService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'Update an assigned unit' })
    @ApiResponse({ status: 200, description: 'The assigned unit has been successfully updated.', type: GroupAssignedUnit })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Assigned unit not found.' })
    async update(
        @Param('id') id: string,
        @Body() updateGroupAssignedUnitDto: UpdateGroupAssignedUnitDto
    ): Promise<GroupAssignedUnit> {
        return await this.groupAssignedUnitsService.update(id, updateGroupAssignedUnitDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete an assigned unit' })
    @ApiResponse({ status: 200, description: 'The assigned unit has been successfully deleted.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Assigned unit not found.' })
    async remove(@Param('id') id: string): Promise<void> {
        return await this.groupAssignedUnitsService.remove(id);
    }
}
