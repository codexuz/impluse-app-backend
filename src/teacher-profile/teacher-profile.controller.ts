import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { TeacherProfileService } from './teacher-profile.service.js';
import { CreateTeacherProfileDto } from './dto/create-teacher-profile.dto.js';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Teacher Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teacher-profile')
export class TeacherProfileController {
  constructor(private readonly teacherProfileService: TeacherProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new teacher profile' })
  create(@Body() createTeacherProfileDto: CreateTeacherProfileDto) {
    return this.teacherProfileService.create(createTeacherProfileDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all teacher profiles' })
  findAll() {
    return this.teacherProfileService.findAll();
  }

  @Get('user/:userId')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get teacher profile by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID (UUID)', type: 'string' })
  findByUserId(@Param('userId') userId: string) {
    return this.teacherProfileService.findByUserId(userId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get teacher profile by ID' })
  @ApiParam({ name: 'id', description: 'Profile ID (UUID)', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.teacherProfileService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update teacher profile' })
  @ApiParam({ name: 'id', description: 'Profile ID (UUID)', type: 'string' })
  update(@Param('id') id: string, @Body() updateTeacherProfileDto: UpdateTeacherProfileDto) {
    return this.teacherProfileService.update(id, updateTeacherProfileDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete teacher profile' })
  @ApiParam({ name: 'id', description: 'Profile ID (UUID)', type: 'string' })
  remove(@Param('id') id: string) {
    return this.teacherProfileService.remove(id);
  }
}
