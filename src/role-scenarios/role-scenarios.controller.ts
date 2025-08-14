import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { RoleScenariosService } from './role-scenarios.service.js';
import { CreateRoleScenarioDto } from './dto/create-role-scenario.dto.js';
import { UpdateRoleScenarioDto } from './dto/update-role-scenario.dto.js';
import { RoleScenario } from './entities/role-scenario.entity.js';

@ApiTags('role-scenarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('role-scenarios')
export class RoleScenariosController {
  constructor(private readonly roleScenariosService: RoleScenariosService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new role scenario' })
  @ApiResponse({ status: 201, type: RoleScenario })
  create(@Body() createRoleScenarioDto: CreateRoleScenarioDto) {
    return this.roleScenariosService.create(createRoleScenarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all role scenarios' })
  @ApiResponse({ status: 200, type: [RoleScenario] })
  findAll() {
    return this.roleScenariosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role scenario by id' })
  @ApiResponse({ status: 200, type: RoleScenario })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(@Param('id') id: string) {
    return this.roleScenariosService.findOne(id);
  }

  @Get('speaking/:speakingId')
  @ApiOperation({ summary: 'Get role scenarios by speaking exercise id' })
  @ApiResponse({ status: 200, type: [RoleScenario] })
  findBySpeakingId(@Param('speakingId') speakingId: string) {
    return this.roleScenariosService.findBySpeakingId(speakingId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update a role scenario' })
  @ApiResponse({ status: 200, type: RoleScenario })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(@Param('id') id: string, @Body() updateRoleScenarioDto: UpdateRoleScenarioDto) {
    return this.roleScenariosService.update(id, updateRoleScenarioDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a role scenario' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Not found' })
  remove(@Param('id') id: string) {
    return this.roleScenariosService.remove(id);
  }
}
