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
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { LeadsService } from "./leads.service.js";
import { CreateLeadDto } from "./dto/create-lead.dto.js";
import { UpdateLeadDto } from "./dto/update-lead.dto.js";
import {
  LeadResponseDto,
  LeadListResponseDto,
  LeadStatsResponseDto,
} from "./dto/lead-response.dto.js";
import { LeadStatsByDateRangeDto } from "./dto/lead-stats-date-range.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("Leads")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("leads")
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a new lead" })
  @ApiResponse({
    status: 201,
    description: "Lead created successfully",
    type: LeadResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin or Manager role required",
  })
  create(@Body() createLeadDto: CreateLeadDto, @CurrentUser() user: any) {
    // Set admin_id from current user if not provided
    if (!createLeadDto.admin_id) {
      createLeadDto.admin_id = user.userId;
    }
    return this.leadsService.create(createLeadDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all leads with pagination and filtering" })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page (default: 10)",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search in name, phone, or question",
  })
  @ApiQuery({
    name: "status",
    required: false,
    type: String,
    description: "Filter by status",
  })
  @ApiQuery({
    name: "source",
    required: false,
    type: String,
    description: "Filter by source",
  })
  @ApiQuery({
    name: "startDate",
    required: false,
    type: String,
    description: "Filter by start date (ISO format)",
  })
  @ApiQuery({
    name: "endDate",
    required: false,
    type: String,
    description: "Filter by end date (ISO format)",
  })
  @ApiResponse({
    status: 200,
    description: "Leads retrieved successfully",
    type: LeadListResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin, Manager, or Teacher role required",
  })
  findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search?: string,
    @Query("status") status?: string,
    @Query("source") source?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.leadsService.findAll(
      +page,
      +limit,
      search,
      status,
      source,
      start,
      end,
    );
  }

  @Get("stats")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get comprehensive lead statistics" })
  @ApiResponse({
    status: 200,
    description: "Lead statistics retrieved successfully",
    type: LeadStatsResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin or Manager role required",
  })
  getStats() {
    return this.leadsService.getLeadStats();
  }

  @Get("stats/by-date-range")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get lead statistics by date range" })
  @ApiResponse({
    status: 200,
    description: "Lead statistics by date range retrieved successfully",
    type: LeadStatsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid date format",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Admin role required" })
  getStatsByDateRange(@Query() dateRangeDto: LeadStatsByDateRangeDto) {
    const startDate = dateRangeDto.startDate
      ? new Date(dateRangeDto.startDate)
      : undefined;
    const endDate = dateRangeDto.endDate
      ? new Date(dateRangeDto.endDate)
      : undefined;
    return this.leadsService.getLeadStatsByDateRange(startDate, endDate);
  }

  @Get("stats/trends")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get lead trends data (daily/weekly/monthly)" })
  @ApiResponse({
    status: 200,
    description: "Lead trends data retrieved successfully",
    schema: {
      properties: {
        daily: {
          type: "array",
          items: {
            properties: {
              date: { type: "string", format: "date" },
              count: { type: "number" },
            },
          },
        },
        weekly: {
          type: "array",
          items: {
            properties: {
              week: { type: "string" },
              count: { type: "number" },
            },
          },
        },
        monthly: {
          type: "array",
          items: {
            properties: {
              month: { type: "string" },
              count: { type: "number" },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Admin role required" })
  getLeadsTrends() {
    return this.leadsService.getLeadsTrends();
  }

  @Get("stats/conversion-rates")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get lead conversion rates" })
  @ApiResponse({
    status: 200,
    description: "Lead conversion rates retrieved successfully",
    schema: {
      properties: {
        overall: { type: "number" },
        bySource: {
          type: "array",
          items: {
            properties: {
              source: { type: "string" },
              rate: { type: "number" },
            },
          },
        },
        byStatus: {
          type: "array",
          items: {
            properties: {
              fromStatus: { type: "string" },
              toStatus: { type: "string" },
              count: { type: "number" },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Admin role required" })
  getConversionRates() {
    return this.leadsService.getConversionRates();
  }

  @Get("stats/admin-performance")
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "Get admin performance statistics with lead conversion rates",
  })
  @ApiResponse({
    status: 200,
    description: "Admin performance statistics retrieved successfully",
    schema: {
      type: "array",
      items: {
        properties: {
          adminId: { type: "string" },
          leadsCount: { type: "number" },
          convertedCount: { type: "number" },
          conversionRate: { type: "number" },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Admin role required" })
  getAdminPerformance() {
    return this.leadsService.getAdminPerformance();
  }

  @Get("stats/time-in-status")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get average time leads spend in each status" })
  @ApiResponse({
    status: 200,
    description: "Average time in status retrieved successfully",
    schema: {
      type: "array",
      items: {
        properties: {
          status: { type: "string" },
          averageDays: { type: "number" },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Admin role required" })
  getAverageTimeInStatus() {
    return this.leadsService.getAverageTimeInStatus();
  }

  @Get("by-status/:status")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get leads by status" })
  @ApiParam({ name: "status", description: "Lead status" })
  @ApiResponse({
    status: 200,
    description: "Leads by status retrieved successfully",
    type: [LeadResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin, Manager, or Teacher role required",
  })
  findByStatus(@Param("status") status: string) {
    return this.leadsService.findByStatus(status);
  }

  @Get("my-leads")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get leads assigned to current admin" })
  @ApiResponse({
    status: 200,
    description: "Admin leads retrieved successfully",
    type: [LeadResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin or Manager role required",
  })
  getMyLeads(@CurrentUser() user: any) {
    return this.leadsService.findByAdminId(user.userId);
  }

  @Get(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get lead by ID" })
  @ApiParam({ name: "id", description: "Lead ID" })
  @ApiResponse({
    status: 200,
    description: "Lead retrieved successfully",
    type: LeadResponseDto,
  })
  @ApiResponse({ status: 404, description: "Lead not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin, Manager, or Teacher role required",
  })
  findOne(@Param("id") id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update lead by ID" })
  @ApiParam({ name: "id", description: "Lead ID" })
  @ApiResponse({
    status: 200,
    description: "Lead updated successfully",
    type: LeadResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 404, description: "Lead not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin or Manager role required",
  })
  update(@Param("id") id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete lead by ID (soft delete)" })
  @ApiParam({ name: "id", description: "Lead ID" })
  @ApiResponse({ status: 204, description: "Lead deleted successfully" })
  @ApiResponse({ status: 404, description: "Lead not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin or Manager role required",
  })
  remove(@Param("id") id: string) {
    return this.leadsService.remove(id);
  }

  @Patch(":id/archive")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Archive a lead by ID" })
  @ApiParam({ name: "id", description: "Lead ID" })
  @ApiResponse({
    status: 200,
    description: "Lead archived successfully",
    type: LeadResponseDto,
  })
  @ApiResponse({ status: 404, description: "Lead not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin role required",
  })
  archive(@Param("id") id: string) {
    return this.leadsService.archive(id);
  }
}
