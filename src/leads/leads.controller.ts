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
import { LeadsService } from './leads.service.js';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { UpdateLeadDto } from './dto/update-lead.dto.js';
import { 
  LeadResponseDto, 
  LeadListResponseDto, 
  LeadStatsResponseDto 
} from './dto/lead-response.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role } from '../roles/role.enum.js';

@ApiTags('Leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new lead' })
  @ApiResponse({ 
    status: 201, 
    description: 'Lead created successfully',
    type: LeadResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' })
  create(@Body() createLeadDto: CreateLeadDto, @CurrentUser() user: any) {
    // Set admin_id from current user if not provided
    if (!createLeadDto.admin_id) {
      createLeadDto.admin_id = user.userId;
    }
    return this.leadsService.create(createLeadDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all leads with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search in name, phone, or question' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
  @ApiResponse({ 
    status: 200, 
    description: 'Leads retrieved successfully',
    type: LeadListResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin, Manager, or Teacher role required' })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('status') status?: string
  ) {
    return this.leadsService.findAll(+page, +limit, search, status);
  }

  @Get('stats')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get lead statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lead statistics retrieved successfully',
    type: LeadStatsResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' })
  getStats() {
    return this.leadsService.getLeadStats();
  }

  @Get('by-status/:status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get leads by status' })
  @ApiParam({ name: 'status', description: 'Lead status' })
  @ApiResponse({ 
    status: 200, 
    description: 'Leads by status retrieved successfully',
    type: [LeadResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin, Manager, or Teacher role required' })
  findByStatus(@Param('status') status: string) {
    return this.leadsService.findByStatus(status);
  }

  @Get('my-leads')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get leads assigned to current admin' })
  @ApiResponse({ 
    status: 200, 
    description: 'Admin leads retrieved successfully',
    type: [LeadResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' })
  getMyLeads(@CurrentUser() user: any) {
    return this.leadsService.findByAdminId(user.userId);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get lead by ID' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lead retrieved successfully',
    type: LeadResponseDto
  })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin, Manager, or Teacher role required' })
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update lead by ID' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lead updated successfully',
    type: LeadResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' })
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete lead by ID (soft delete)' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  @ApiResponse({ status: 204, description: 'Lead deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' })
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }
}
