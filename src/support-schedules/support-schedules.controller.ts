import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Query,
  HttpStatus
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { SupportSchedulesService } from './support-schedules.service.js';
import { 
  CreateSupportScheduleDto, 
  UpdateSupportScheduleDto, 
  SupportScheduleResponseDto 
} from './dto/index.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';

@ApiTags('Support Schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('support-schedules')
export class SupportSchedulesController {
  constructor(private readonly supportSchedulesService: SupportSchedulesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER)
  @ApiOperation({ summary: 'Create a new support schedule' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Support schedule has been successfully created.',
    type: SupportScheduleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async create(@Body() createSupportScheduleDto: CreateSupportScheduleDto) {
    return this.supportSchedulesService.create(createSupportScheduleDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER)
  @ApiOperation({ summary: 'Get all support schedules' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all support schedules.',
    type: [SupportScheduleResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async findAll() {
    return this.supportSchedulesService.findAll();
  }

  @Get('teacher/:teacherId')
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER)
  @ApiOperation({ summary: 'Get support schedules by teacher ID' })
  @ApiParam({ name: 'teacherId', description: 'Teacher ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of support schedules for the specified teacher.',
    type: [SupportScheduleResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async findByTeacher(@Param('teacherId') teacherId: string) {
    return this.supportSchedulesService.findByTeacher(teacherId);
  }

  @Get('group/:groupId')
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER)
  @ApiOperation({ summary: 'Get support schedules by group ID' })
  @ApiParam({ name: 'groupId', description: 'Group ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of support schedules for the specified group.',
    type: [SupportScheduleResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async findByGroup(@Param('groupId') groupId: string) {
    return this.supportSchedulesService.findByGroup(groupId);
  }

  @Get('date-range')
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER)
  @ApiOperation({ summary: 'Get support schedules within a date range' })
  @ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of support schedules within the specified date range.',
    type: [SupportScheduleResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid date format.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.supportSchedulesService.findByDateRange(start, end);
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER)
  @ApiOperation({ summary: 'Get support schedule statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Support schedule statistics.',
    schema: {
      type: 'object',
      properties: {
        totalSchedules: { type: 'number' },
        upcomingSchedules: { type: 'number' },
        pastSchedules: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async getStats() {
    return this.supportSchedulesService.getScheduleStats();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER)
  @ApiOperation({ summary: 'Get a support schedule by ID' })
  @ApiParam({ name: 'id', description: 'Support schedule ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Support schedule details.',
    type: SupportScheduleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Support schedule not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async findOne(@Param('id') id: string) {
    return this.supportSchedulesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER)
  @ApiOperation({ summary: 'Update a support schedule' })
  @ApiParam({ name: 'id', description: 'Support schedule ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Support schedule has been successfully updated.',
    type: SupportScheduleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Support schedule not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async update(@Param('id') id: string, @Body() updateSupportScheduleDto: UpdateSupportScheduleDto) {
    return this.supportSchedulesService.update(id, updateSupportScheduleDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER)
  @ApiOperation({ summary: 'Delete a support schedule' })
  @ApiParam({ name: 'id', description: 'Support schedule ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Support schedule has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Support schedule not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async remove(@Param('id') id: string) {
    return this.supportSchedulesService.remove(id);
  }
}
