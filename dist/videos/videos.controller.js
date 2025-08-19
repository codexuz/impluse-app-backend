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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, } from '@nestjs/common';
import { VideosService } from './videos.service.js';
import { CreateVideoDto } from './dto/create-video.dto.js';
import { UpdateVideoDto } from './dto/update-video.dto.js';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
let VideosController = class VideosController {
    constructor(videosService) {
        this.videosService = videosService;
    }
    create(createVideoDto) {
        return this.videosService.create(createVideoDto);
    }
    findAll() {
        return this.videosService.findAll();
    }
    findOne(id) {
        return this.videosService.findOne(id);
    }
    getVideoWithYouTubeId(id) {
        return this.videosService.getVideoWithYouTubeId(id);
    }
    async findOneWithCaptions(id) {
        const video = await this.videosService.findOne(id);
        const videoData = video.toJSON();
        return {
            ...videoData,
            youtubeId: video.youtubeId,
            subtitles: video.subtitle
        };
    }
    async getWebVTTCaptions(id) {
        return await this.videosService.getWebVTTCaptions(id);
    }
    async downloadWebVTTCaptions(id, response) {
        const webvtt = await this.videosService.getWebVTTCaptions(id);
        response.setHeader('Content-Type', 'text/vtt');
        response.setHeader('Content-Disposition', `attachment; filename="captions-${id}.vtt"`);
        return response.send(webvtt);
    }
    refreshCaptions(id) {
        return this.videosService.refreshCaptions(id);
    }
    update(id, updateVideoDto) {
        return this.videosService.update(id, updateVideoDto);
    }
    incrementViews(id) {
        return this.videosService.incrementViews(id);
    }
    remove(id) {
        return this.videosService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new video' }),
    ApiResponse({ status: 201, description: 'Video created successfully' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateVideoDto]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.STUDENT, Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all videos' }),
    ApiResponse({ status: 200, description: 'Return all videos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    Roles(Role.TEACHER, Role.ADMIN, Role.STUDENT),
    ApiOperation({ summary: 'Get video by id' }),
    ApiResponse({ status: 200, description: 'Return video by id' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "findOne", null);
__decorate([
    Get(':id/youtube'),
    Roles(Role.TEACHER, Role.ADMIN, Role.STUDENT),
    ApiOperation({ summary: 'Get video with YouTube ID' }),
    ApiResponse({ status: 200, description: 'Return video with extracted YouTube ID' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "getVideoWithYouTubeId", null);
__decorate([
    Get(':id/with-captions'),
    Roles(Role.TEACHER, Role.ADMIN, Role.STUDENT),
    ApiOperation({ summary: 'Get video by id with WebVTT captions' }),
    ApiResponse({ status: 200, description: 'Return video by id with WebVTT captions' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "findOneWithCaptions", null);
__decorate([
    Get(':id/captions'),
    Roles(Role.TEACHER, Role.ADMIN, Role.STUDENT),
    ApiOperation({ summary: 'Get video captions in WebVTT format' }),
    ApiResponse({ status: 200, description: 'Return WebVTT format captions' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "getWebVTTCaptions", null);
__decorate([
    Get(':id/captions/download'),
    Roles(Role.TEACHER, Role.ADMIN, Role.STUDENT),
    ApiOperation({ summary: 'Download video captions as WebVTT file' }),
    ApiResponse({ status: 200, description: 'Download WebVTT file' }),
    __param(0, Param('id')),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "downloadWebVTTCaptions", null);
__decorate([
    Post(':id/refresh-captions'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Refresh video captions from YouTube' }),
    ApiResponse({ status: 200, description: 'Captions refreshed successfully' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "refreshCaptions", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update video by id' }),
    ApiResponse({ status: 200, description: 'Video updated successfully' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateVideoDto]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "update", null);
__decorate([
    Post(':id/view'),
    Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN),
    ApiOperation({ summary: 'Increment video views' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "incrementViews", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Delete video by id' }),
    ApiResponse({ status: 200, description: 'Video deleted successfully' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "remove", null);
VideosController = __decorate([
    ApiTags('videos'),
    Controller('videos'),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    __metadata("design:paramtypes", [VideosService])
], VideosController);
export { VideosController };
//# sourceMappingURL=videos.controller.js.map