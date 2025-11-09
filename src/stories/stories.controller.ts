import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { StoriesService } from './stories.service.js';
import { CreateStoryDto } from './dto/create-story.dto.js';
import { UpdateStoryDto } from './dto/update-story.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';

@ApiTags('Stories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new story' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'The story has been successfully created.'
  })
  async create(@Body() createStoryDto: CreateStoryDto) {
    return await this.storiesService.create(createStoryDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all published stories' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return all published stories'
  })
  async findAll() {
    return await this.storiesService.findAll();
  }

  @Get('type/:type')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get published stories by type (video or image)' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return published stories of specified type'
  })
  async findByType(@Param('type') type: 'video' | 'image') {
    return await this.storiesService.findByType(type);
  }

  @Get('admin')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all stories (including unpublished) - Admin only' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return all stories (published and unpublished)'
  })
  async findAllAdmin() {
    return await this.storiesService.findAllAdmin();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get a story by ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return the requested story'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Story not found or not published'
  })
  async findOne(@Param('id') id: string) {
    return await this.storiesService.findOne(id);
  }

  @Get('admin/:id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get any story by ID (including unpublished) - Admin only' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return the requested story'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Story not found'
  })
  async findOneAdmin(@Param('id') id: string) {
    return await this.storiesService.findOneAdmin(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update a story' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The story has been successfully updated.'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Story not found'
  })
  async update(@Param('id') id: string, @Body() updateStoryDto: UpdateStoryDto) {
    return await this.storiesService.update(id, updateStoryDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a story' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'The story has been successfully deleted.'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Story not found'
  })
  async remove(@Param('id') id: string) {
    return await this.storiesService.remove(id);
  }

  @Patch(':id/publish')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Publish a story' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The story has been successfully published.'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Story not found'
  })
  async publish(@Param('id') id: string) {
    return await this.storiesService.publish(id);
  }

  @Patch(':id/unpublish')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Unpublish a story' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The story has been successfully unpublished.'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Story not found'
  })
  async unpublish(@Param('id') id: string) {
    return await this.storiesService.unpublish(id);
  }

  @Patch(':id/view')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Increment the view count of a story' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The story view count has been successfully incremented.'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Story not found'
  })
  async incrementViewCount(@Param('id') id: string) {
    return await this.storiesService.incrementViewCount(id);
  }

  @Patch(':id/like')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Increment the likes count of a story' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The story likes count has been successfully incremented.'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Story not found'
  })
  async incrementLikesCount(@Param('id') id: string) {
    return await this.storiesService.incrementLikesCount(id);
  }

  @Patch(':id/unlike')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Decrement the likes count of a story' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The story likes count has been successfully decremented.'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Story not found'
  })
  async decrementLikesCount(@Param('id') id: string) {
    return await this.storiesService.decrementLikesCount(id);
  }
}
