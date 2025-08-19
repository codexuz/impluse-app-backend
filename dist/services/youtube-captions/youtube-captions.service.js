var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@nestjs/common";
import { getVideoDetails } from "youtube-caption-extractor";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
let YoutubeCaptionsService = class YoutubeCaptionsService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.youtubeAPIKey = this.configService.get("youtubeAPIKey");
    }
    async getCaptions(videoId) {
        try {
            const videoDetails = await getVideoDetails({
                videoID: videoId,
                lang: "en",
            });
            return videoDetails || [];
        }
        catch (error) {
            console.error("Error fetching YouTube captions:", error);
            throw new Error("Could not fetch captions for the provided video ID.");
        }
    }
    async getCaptionsAsWebVTT(videoId) {
        try {
            const videoDetails = await getVideoDetails({
                videoID: videoId,
                lang: "en",
            });
            if (!videoDetails || !videoDetails.subtitles) {
                throw new Error("No subtitles found for this video");
            }
            return this.convertToWebVTT(videoDetails.subtitles);
        }
        catch (error) {
            console.error("Error fetching YouTube captions:", error);
            throw new Error("Could not fetch captions for the provided video ID.");
        }
    }
    convertToWebVTT(subtitles) {
        let webVTT = 'WEBVTT\n\n';
        subtitles.forEach((subtitle, index) => {
            const { start, dur, text } = subtitle;
            const startTime = this.formatTime(parseFloat(start));
            const endTime = this.formatTime(parseFloat(start) + parseFloat(dur));
            webVTT += `${index + 1}\n`;
            webVTT += `${startTime} --> ${endTime}\n`;
            webVTT += `${text}\n\n`;
        });
        return webVTT;
    }
    formatTime(seconds) {
        const date = new Date(seconds * 1000);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const secs = date.getUTCSeconds().toString().padStart(2, '0');
        const millisecs = date.getUTCMilliseconds().toString().padStart(3, '0');
        return `${hours}:${minutes}:${secs}.${millisecs}`;
    }
    async getVideoInfo(videoId) {
        try {
            const response = await this.httpService.axiosRef.get('https://www.googleapis.com/youtube/v3/videos', {
                params: {
                    part: 'snippet,contentDetails,statistics',
                    id: videoId,
                    key: this.youtubeAPIKey,
                },
            });
            const videoInfo = response.data.items[0];
            return videoInfo || null;
        }
        catch (error) {
            console.error("Error fetching YouTube video info:", error?.response?.data || error);
            throw new Error("Could not fetch video info for the provided video ID.");
        }
    }
};
YoutubeCaptionsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HttpService, ConfigService])
], YoutubeCaptionsService);
export { YoutubeCaptionsService };
//# sourceMappingURL=youtube-captions.service.js.map