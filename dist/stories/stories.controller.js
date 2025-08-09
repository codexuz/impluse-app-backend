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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { StoriesService } from './stories.service.js';
import { CreateStoryDto } from './dto/create-story.dto.js';
import { UpdateStoryDto } from './dto/update-story.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
let StoriesController = class StoriesController {
    constructor(storiesService) {
        this.storiesService = storiesService;
    }
    async create(createStoryDto) {
        return await this.storiesService.create(createStoryDto);
    }
    async findAll() {
        return await this.storiesService.findAll();
    }
    async findAllAdmin() {
        return await this.storiesService.findAllAdmin();
    }
    async findOne(id) {
        return await this.storiesService.findOne(id);
    }
    async findOneAdmin(id) {
        return await this.storiesService.findOneAdmin(id);
    }
    async update(id, updateStoryDto) {
        return await this.storiesService.update(id, updateStoryDto);
    }
    async remove(id) {
        return await this.storiesService.remove(id);
    }
    async publish(id) {
        return await this.storiesService.publish(id);
    }
    async unpublish(id) {
        return await this.storiesService.unpublish(id);
    }
    async incrementViewCount(id) {
        return await this.storiesService.incrementViewCount(id);
    }
};
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new story' }),
    ApiResponse({
        status: HttpStatus.CREATED,
        description: 'The story has been successfully created.'
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateStoryDto]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all published stories' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'Return all published stories'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "findAll", null);
__decorate([
    Get('admin'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all stories (including unpublished) - Admin only' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'Return all stories (published and unpublished)'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "findAllAdmin", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get a story by ID' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'Return the requested story'
    }),
    ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Story not found or not published'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "findOne", null);
__decorate([
    Get('admin/:id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get any story by ID (including unpublished) - Admin only' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'Return the requested story'
    }),
    ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Story not found'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "findOneAdmin", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update a story' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'The story has been successfully updated.'
    }),
    ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Story not found'
    }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateStoryDto]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: 'Delete a story' }),
    ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'The story has been successfully deleted.'
    }),
    ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Story not found'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "remove", null);
__decorate([
    Patch(':id/publish'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Publish a story' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'The story has been successfully published.'
    }),
    ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Story not found'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "publish", null);
__decorate([
    Patch(':id/unpublish'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Unpublish a story' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'The story has been successfully unpublished.'
    }),
    ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Story not found'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "unpublish", null);
__decorate([
    Patch(':id/view'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Increment the view count of a story' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'The story view count has been successfully incremented.'
    }),
    ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Story not found'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "incrementViewCount", null);
StoriesController = __decorate([
    ApiTags('Stories'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('stories'),
    __metadata("design:paramtypes", [StoriesService])
], StoriesController);
export { StoriesController };
//# sourceMappingURL=stories.controller.js.map