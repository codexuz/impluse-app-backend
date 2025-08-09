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
import { Injectable, NotFoundException, BadRequestException, } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Video } from "./entities/video.entity.js";
import { YoutubeCaptionsService } from "../services/youtube-captions/youtube-captions.service.js";
import getVideoId from "get-video-id";
let VideosService = class VideosService {
    constructor(videoModel, youtubeCaptionsService) {
        this.videoModel = videoModel;
        this.youtubeCaptionsService = youtubeCaptionsService;
    }
    extractYoutubeId(url) {
        const { id } = getVideoId(url);
        if (!id) {
            throw new BadRequestException("Invalid YouTube URL");
        }
        return id;
    }
    async create(createVideoDto) {
        try {
            const videoId = this.extractYoutubeId(createVideoDto.url);
            const { title, description } = await this.youtubeCaptionsService.getCaptions(videoId);
            const subtitlesWebVTT = await this.youtubeCaptionsService.getCaptionsAsWebVTT(videoId);
            const videoInfo = await this.youtubeCaptionsService.getVideoInfo(videoId);
            return this.videoModel.create({
                title: title,
                description: description,
                url: createVideoDto.url,
                subtitle: subtitlesWebVTT,
                thumbnail: videoInfo.snippet?.thumbnails?.high?.url || '',
                views: 0,
                source: createVideoDto.source || "YouTube",
                level: createVideoDto.level || null,
            });
        }
        catch (error) {
            throw new BadRequestException(`Failed to create video: ${error.message}`);
        }
    }
    async findAll() {
        return this.videoModel.findAll({
            order: [["created_at", "DESC"]],
            attributes: {
                exclude: ["deletedAt", "subtitle"],
            },
        });
    }
    async findOne(id) {
        const video = await this.videoModel.findByPk(id);
        if (!video) {
            throw new NotFoundException(`Video with ID ${id} not found`);
        }
        try {
            const youtubeId = this.extractYoutubeId(video.url);
            video.youtubeId = youtubeId;
        }
        catch (error) {
            console.warn(`Could not extract YouTube ID for video ${id}: ${error.message}`);
        }
        return video;
    }
    async getWebVTTCaptions(id) {
        const video = await this.findOne(id);
        const youtubeId = video.youtubeId || this.extractYoutubeId(video.url);
        return this.youtubeCaptionsService.getCaptionsAsWebVTT(youtubeId);
    }
    async refreshCaptions(id) {
        const video = await this.findOne(id);
        const youtubeId = video.youtubeId || this.extractYoutubeId(video.url);
        try {
            const subtitlesWebVTT = await this.youtubeCaptionsService.getCaptionsAsWebVTT(youtubeId);
            await video.update({
                subtitle: subtitlesWebVTT
            });
            return video;
        }
        catch (error) {
            throw new BadRequestException(`Failed to refresh captions: ${error.message}`);
        }
    }
    async update(id, updateVideoDto) {
        const video = await this.findOne(id);
        await video.update(updateVideoDto);
        return video;
    }
    async remove(id) {
        const video = await this.findOne(id);
        await video.destroy();
    }
    async incrementViews(id) {
        const video = await this.findOne(id);
        await video.increment("views");
        return video.reload();
    }
    async getVideoWithYouTubeId(id) {
        const video = await this.findOne(id);
        return {
            id: video.id,
            title: video.title,
            description: video.description,
            url: video.url,
            level: video.level,
            thumbnail: video.thumbnail,
            views: video.views,
            subtitle: video.subtitle,
            source: video.source,
            created_at: video.created_at,
            updated_at: video.updated_at,
            youtubeId: video.youtubeId || this.extractYoutubeId(video.url)
        };
    }
};
VideosService = __decorate([
    Injectable(),
    __param(0, InjectModel(Video)),
    __metadata("design:paramtypes", [Object, YoutubeCaptionsService])
], VideosService);
export { VideosService };
//# sourceMappingURL=videos.service.js.map