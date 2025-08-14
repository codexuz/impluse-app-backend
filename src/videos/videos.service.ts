import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Video } from "./entities/video.entity.js";
import { CreateVideoDto } from "./dto/create-video.dto.js";
import { UpdateVideoDto } from "./dto/update-video.dto.js";
import { YoutubeCaptionsService } from "../services/youtube-captions/youtube-captions.service.js";
import getVideoId from "get-video-id";

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(Video)
    private videoModel: typeof Video,
    private youtubeCaptionsService: YoutubeCaptionsService
  ) {}

  private extractYoutubeId(url: string): string {
    const { id } = getVideoId(url);

    if (!id) {
      throw new BadRequestException("Invalid YouTube URL");
    }

    return id;
  }

  async create(createVideoDto: CreateVideoDto): Promise<Video> {
    try {
      const videoId = this.extractYoutubeId(createVideoDto.url);
      
      // Get video details
      const { title, description } = await this.youtubeCaptionsService.getCaptions(videoId);
      
      // Get captions in WebVTT format
      const subtitlesWebVTT = await this.youtubeCaptionsService.getCaptionsAsWebVTT(videoId);
      
      // Get additional video info
      const videoInfo = await this.youtubeCaptionsService.getVideoInfo(videoId);
      
      // Create video with fetched data
      return this.videoModel.create({
        title: title,
        description: description,
        url: createVideoDto.url,
        subtitle: subtitlesWebVTT,
        thumbnail: videoInfo.snippet?.thumbnails?.high?.url || '',
        views: 0,
        source: createVideoDto.source || "YouTube",
        level: createVideoDto.level || null, // Optional field for course level
      });

    } catch (error) {
      throw new BadRequestException(
        `Failed to create video: ${error.message}`
      );
    }
  }

  async findAll(): Promise<Video[]> {
    return this.videoModel.findAll({
      order: [["created_at", "DESC"]],
      attributes: {
        exclude: ["deletedAt", "subtitle"],
      },
    });
  }

  async findOne(id: string): Promise<Video> {
    const video = await this.videoModel.findByPk(id);
    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    
    // Extract YouTube ID from the URL and include it in the response
    try {
      const youtubeId = this.extractYoutubeId(video.url);
      // Add the youtubeId as a virtual property
      (video as any).youtubeId = youtubeId;
    } catch (error) {
      // If URL is invalid or not a YouTube URL, continue without youtubeId
      console.warn(`Could not extract YouTube ID for video ${id}: ${error.message}`);
    }
    
    return video;
  }
  
  async getWebVTTCaptions(id: string): Promise<string> {
    const video = await this.findOne(id);
    const youtubeId = (video as any).youtubeId || this.extractYoutubeId(video.url);
    return this.youtubeCaptionsService.getCaptionsAsWebVTT(youtubeId);
  }
  
  async refreshCaptions(id: string): Promise<Video> {
    const video = await this.findOne(id);
    const youtubeId = (video as any).youtubeId || this.extractYoutubeId(video.url);
    
    try {
      // Get fresh WebVTT captions
      const subtitlesWebVTT = await this.youtubeCaptionsService.getCaptionsAsWebVTT(youtubeId);
      
      // Update the video with the new captions
      await video.update({
        subtitle: subtitlesWebVTT
      });
      
      return video;
    } catch (error) {
      throw new BadRequestException(
        `Failed to refresh captions: ${error.message}`
      );
    }
  }

  async update(id: string, updateVideoDto: UpdateVideoDto): Promise<Video> {
    const video = await this.findOne(id);
    await video.update(updateVideoDto);
    return video;
  }

  async remove(id: string): Promise<void> {
    const video = await this.findOne(id);
    await video.destroy();
  }

  async incrementViews(id: string): Promise<Video> {
    const video = await this.findOne(id);
    await video.increment("views");
    return video.reload();
  }
  
  async getVideoWithYouTubeId(id: string): Promise<any> {
    const video = await this.findOne(id);
    
    // Extract necessary data and include the youtubeId
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
      youtubeId: (video as any).youtubeId || this.extractYoutubeId(video.url)
    };
  }
}
