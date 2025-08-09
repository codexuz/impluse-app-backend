var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { LeadsService } from './leads.service.js';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { UpdateLeadDto } from './dto/update-lead.dto.js';
import { LeadResponseDto, LeadListResponseDto, LeadStatsResponseDto } from './dto/lead-response.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role } from '../roles/role.enum.js';
let LeadsController = class LeadsController {
    constructor(leadsService) {
        this.leadsService = leadsService;
    }
    create(createLeadDto, user) {
        if (!createLeadDto.admin_id) {
            createLeadDto.admin_id = user.userId;
        }
        return this.leadsService.create(createLeadDto);
    }
    findAll(page = 1, limit = 10, search, status) {
        return this.leadsService.findAll(+page, +limit, search, status);
    }
    getStats() {
        return this.leadsService.getLeadStats();
    }
    findByStatus(status) {
        return this.leadsService.findByStatus(status);
    }
    getMyLeads(user) {
        return this.leadsService.findByAdminId(user.userId);
    }
    findOne(id) {
        return this.leadsService.findOne(id);
    }
    update(id, updateLeadDto) {
        return this.leadsService.update(id, updateLeadDto);
    }
    remove(id) {
        return this.leadsService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Create a new lead' }),
    ApiResponse({
        status: 201,
        description: 'Lead created successfully',
        type: LeadResponseDto
    }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' }),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateLeadDto, Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Get all leads with pagination and filtering' }),
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' }),
    ApiQuery({ name: 'search', required: false, type: String, description: 'Search in name, phone, or question' }),
    ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' }),
    ApiResponse({
        status: 200,
        description: 'Leads retrieved successfully',
        type: LeadListResponseDto
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden - Admin, Manager, or Teacher role required' }),
    __param(0, Query('page')),
    __param(1, Query('limit')),
    __param(2, Query('search')),
    __param(3, Query('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "findAll", null);
__decorate([
    Get('stats'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Get lead statistics' }),
    ApiResponse({
        status: 200,
        description: 'Lead statistics retrieved successfully',
        type: LeadStatsResponseDto
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "getStats", null);
__decorate([
    Get('by-status/:status'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Get leads by status' }),
    ApiParam({ name: 'status', description: 'Lead status' }),
    ApiResponse({
        status: 200,
        description: 'Leads by status retrieved successfully',
        type: [LeadResponseDto]
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden - Admin, Manager, or Teacher role required' }),
    __param(0, Param('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "findByStatus", null);
__decorate([
    Get('my-leads'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Get leads assigned to current admin' }),
    ApiResponse({
        status: 200,
        description: 'Admin leads retrieved successfully',
        type: [LeadResponseDto]
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "getMyLeads", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Get lead by ID' }),
    ApiParam({ name: 'id', description: 'Lead ID' }),
    ApiResponse({
        status: 200,
        description: 'Lead retrieved successfully',
        type: LeadResponseDto
    }),
    ApiResponse({ status: 404, description: 'Lead not found' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden - Admin, Manager, or Teacher role required' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Update lead by ID' }),
    ApiParam({ name: 'id', description: 'Lead ID' }),
    ApiResponse({
        status: 200,
        description: 'Lead updated successfully',
        type: LeadResponseDto
    }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 404, description: 'Lead not found' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateLeadDto]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: 'Delete lead by ID (soft delete)' }),
    ApiParam({ name: 'id', description: 'Lead ID' }),
    ApiResponse({ status: 204, description: 'Lead deleted successfully' }),
    ApiResponse({ status: 404, description: 'Lead not found' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "remove", null);
LeadsController = __decorate([
    ApiTags('Leads'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('leads'),
    __metadata("design:paramtypes", [LeadsService])
], LeadsController);
export { LeadsController };
//# sourceMappingURL=leads.controller.js.map