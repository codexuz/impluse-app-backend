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
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiQuery,
  ApiParam
} from '@nestjs/swagger';
import { LeadTrialLessonsService } from './lead-trial-lessons.service.js';
import { CreateLeadTrialLessonDto } from './dto/create-lead-trial-lesson.dto.js';
import { UpdateLeadTrialLessonDto } from './dto/update-lead-trial-lesson.dto.js';
import { 
  TrialLessonResponseDto, 
  TrialLessonListResponseDto, 
  TrialLessonStatsResponseDto 
} from './dto/trial-lesson-response.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role } from '../roles/role.enum.js';

@ApiTags('Lead Trial Lessons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lead-trial-lessons')
export class LeadTrialLessonsController {
  constructor(private readonly leadTrialLessonsService: LeadTrialLessonsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new trial lesson' })
  @ApiResponse({ 
    status: 201, 
    description: 'Trial lesson created successfully',
    type: TrialLessonResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' })
  create(@Body() createLeadTrialLessonDto: CreateLeadTrialLessonDto) {
    return this.leadTrialLessonsService.create(createLeadTrialLessonDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all trial lessons with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search in notes' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
  @ApiQuery({ name: 'teacherId', required: false, type: String, description: 'Filter by teacher ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Trial lessons retrieved successfully',
    type: TrialLessonListResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin, Manager, or Teacher role required' })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('teacherId') teacherId?: string
  ) {
    return this.leadTrialLessonsService.findAll(+page, +limit, search, status, teacherId);
  }

  @Get('stats')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get trial lesson statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Trial lesson statistics retrieved successfully',
    type: TrialLessonStatsResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' })
  getStats() {
    return this.leadTrialLessonsService.getTrialLessonStats();
  }

  @Get('upcoming')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get upcoming trial lessons' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Maximum number of results (default: 20)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Upcoming trial lessons retrieved successfully',
    type: [TrialLessonResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin, Manager, or Teacher role required' })
  findUpcoming(@Query('limit') limit = 20) {
    return this.leadTrialLessonsService.findUpcoming(+limit);
  }

  @Get('by-status/:status')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get trial lessons by status' })
  @ApiParam({ name: 'status', description: 'Trial lesson status' })
  @ApiResponse({ 
    status: 200, 
    description: 'Trial lessons by status retrieved successfully',
    type: [TrialLessonResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin, Manager, or Teacher role required' })
  findByStatus(@Param('status') status: string) {
    return this.leadTrialLessonsService.findByStatus(status);
  }

  @Get('by-teacher/:teacherId')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get trial lessons by teacher' })
  @ApiParam({ name: 'teacherId', description: 'Teacher ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Trial lessons by teacher retrieved successfully',
    type: [TrialLessonResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin, Manager, or Teacher role required' })
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.leadTrialLessonsService.findByTeacher(teacherId);
  }

  @Get('by-lead/:leadId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get trial lessons by lead' })
  @ApiParam({ name: 'leadId', description: 'Lead ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Trial lessons by lead retrieved successfully',
    type: [TrialLessonResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin, Manager, or Teacher role required' })
  findByLead(@Param('leadId') leadId: string) {
    return this.leadTrialLessonsService.findByLead(leadId);
  }

  @Get('my-lessons')
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: 'Get trial lessons assigned to current teacher' })
  @ApiResponse({ 
    status: 200, 
    description: 'Teacher trial lessons retrieved successfully',
    type: [TrialLessonResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Teacher role required' })
  getMyLessons(@CurrentUser() user: any) {
    return this.leadTrialLessonsService.findByTeacher(user.userId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get trial lesson by ID' })
  @ApiParam({ name: 'id', description: 'Trial lesson ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Trial lesson retrieved successfully',
    type: TrialLessonResponseDto
  })
  @ApiResponse({ status: 404, description: 'Trial lesson not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin, Manager, or Teacher role required' })
  findOne(@Param('id') id: string) {
    return this.leadTrialLessonsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update trial lesson by ID' })
  @ApiParam({ name: 'id', description: 'Trial lesson ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Trial lesson updated successfully',
    type: TrialLessonResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Trial lesson not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin, Manager, or Teacher role required' })
  update(@Param('id') id: string, @Body() updateLeadTrialLessonDto: UpdateLeadTrialLessonDto) {
    return this.leadTrialLessonsService.update(id, updateLeadTrialLessonDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete trial lesson by ID (soft delete)' })
  @ApiParam({ name: 'id', description: 'Trial lesson ID' })
  @ApiResponse({ status: 204, description: 'Trial lesson deleted successfully' })
  @ApiResponse({ status: 404, description: 'Trial lesson not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' })
  remove(@Param('id') id: string) {
    return this.leadTrialLessonsService.remove(id);
  }
}
