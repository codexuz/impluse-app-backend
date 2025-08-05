import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { VideosService } from './videos.service.js';
import { CreateVideoDto } from './dto/create-video.dto.js';
import { UpdateVideoDto } from './dto/update-video.dto.js';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';

@ApiTags('videos')
@Controller('videos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new video' })
  @ApiResponse({ status: 201, description: 'Video created successfully' })
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videosService.create(createVideoDto);
  }

  @Get()
  @Roles(Role.STUDENT, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all videos' })
  @ApiResponse({ status: 200, description: 'Return all videos' })
  findAll() {
    return this.videosService.findAll();
  }

  @Get(':id')
  @Roles(Role.TEACHER, Role.ADMIN, Role.STUDENT)
  @ApiOperation({ summary: 'Get video by id' })
  @ApiResponse({ status: 200, description: 'Return video by id' })
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(id);
  }
  
  @Get(':id/youtube')
  @Roles(Role.TEACHER, Role.ADMIN, Role.STUDENT)
  @ApiOperation({ summary: 'Get video with YouTube ID' })
  @ApiResponse({ status: 200, description: 'Return video with extracted YouTube ID' })
  getVideoWithYouTubeId(@Param('id') id: string) {
    return this.videosService.getVideoWithYouTubeId(id);
  }
  
  @Get(':id/with-captions')
  @Roles(Role.TEACHER, Role.ADMIN, Role.STUDENT)
  @ApiOperation({ summary: 'Get video by id with WebVTT captions' })
  @ApiResponse({ status: 200, description: 'Return video by id with WebVTT captions' })
  async findOneWithCaptions(@Param('id') id: string) {
    const video = await this.videosService.findOne(id);
    const videoData = video.toJSON();
    return {
      ...videoData,
      youtubeId: (video as any).youtubeId,
      subtitles: video.subtitle // WebVTT format is already stored in the subtitle field
    };
  }
  
  @Get(':id/captions')
  @Roles(Role.TEACHER, Role.ADMIN, Role.STUDENT)
  @ApiOperation({ summary: 'Get video captions in WebVTT format' })
  @ApiResponse({ status: 200, description: 'Return WebVTT format captions' })
  async getWebVTTCaptions(@Param('id') id: string) {
    return await this.videosService.getWebVTTCaptions(id);
  }
  
  @Get(':id/captions/download')
  @Roles(Role.TEACHER, Role.ADMIN, Role.STUDENT)
  @ApiOperation({ summary: 'Download video captions as WebVTT file' })
  @ApiResponse({ status: 200, description: 'Download WebVTT file' })
  async downloadWebVTTCaptions(@Param('id') id: string, @Res() response: Response) {
    const webvtt = await this.videosService.getWebVTTCaptions(id);
    
    response.setHeader('Content-Type', 'text/vtt');
    response.setHeader('Content-Disposition', `attachment; filename="captions-${id}.vtt"`);
    return response.send(webvtt);
  }
  
  @Post(':id/refresh-captions')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Refresh video captions from YouTube' })
  @ApiResponse({ status: 200, description: 'Captions refreshed successfully' })
  refreshCaptions(@Param('id') id: string) {
    return this.videosService.refreshCaptions(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update video by id' })
  @ApiResponse({ status: 200, description: 'Video updated successfully' })
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(id, updateVideoDto);
  }

  @Post(':id/view')
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Increment video views' })
  incrementViews(@Param('id') id: string) {
    return this.videosService.incrementViews(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Delete video by id' })
  @ApiResponse({ status: 200, description: 'Video deleted successfully' })
  remove(@Param('id') id: string) {
    return this.videosService.remove(id);
  }
}