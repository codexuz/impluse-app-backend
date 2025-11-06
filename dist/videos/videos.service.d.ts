import { Video } from "./entities/video.entity.js";
import { CreateVideoDto } from "./dto/create-video.dto.js";
import { UpdateVideoDto } from "./dto/update-video.dto.js";
import { YoutubeCaptionsService } from "../services/youtube-captions/youtube-captions.service.js";
export declare class VideosService {
    private videoModel;
    private youtubeCaptionsService;
    constructor(videoModel: typeof Video, youtubeCaptionsService: YoutubeCaptionsService);
    private extractYoutubeId;
    create(createVideoDto: CreateVideoDto): Promise<Video>;
    findAll(): Promise<Video[]>;
    findOne(id: string): Promise<Video>;
    getWebVTTCaptions(id: string): Promise<string>;
    refreshCaptions(id: string): Promise<Video>;
    update(id: string, updateVideoDto: UpdateVideoDto): Promise<Video>;
    remove(id: string): Promise<void>;
    incrementViews(id: string): Promise<Video>;
    getVideoWithYouTubeId(id: string): Promise<any>;
}
