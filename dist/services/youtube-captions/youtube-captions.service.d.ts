import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
export declare class YoutubeCaptionsService {
    private readonly httpService;
    private configService;
    private readonly youtubeAPIKey;
    constructor(httpService: HttpService, configService: ConfigService);
    getCaptions(videoId: string): Promise<any>;
    getCaptionsAsWebVTT(videoId: string): Promise<string>;
    private convertToWebVTT;
    private formatTime;
    getVideoInfo(videoId: string): Promise<any>;
}
