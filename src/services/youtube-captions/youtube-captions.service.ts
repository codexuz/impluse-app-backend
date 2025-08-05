import { Injectable } from "@nestjs/common";
import { getSubtitles, getVideoDetails } from "youtube-caption-extractor";
import { HttpService } from "@nestjs/axios";
@Injectable()
export class YoutubeCaptionsService {
  constructor(private readonly httpService: HttpService) {}

  async getCaptions(videoId: string): Promise<any> {
    try {
      const videoDetails = await getVideoDetails({
        videoID: videoId,
        lang: "en", // You can change the language code as needed
      });

      return videoDetails || [];
    } catch (error) {
      console.error("Error fetching YouTube captions:", error);
      throw new Error("Could not fetch captions for the provided video ID.");
    }
  }

  async getCaptionsAsWebVTT(videoId: string): Promise<string> {
    try {
      const videoDetails = await getVideoDetails({
        videoID: videoId,
        lang: "en", // You can change the language code as needed
      });
      
      if (!videoDetails || !videoDetails.subtitles) {
        throw new Error("No subtitles found for this video");
      }
      
      // Convert JSON subtitles to WebVTT format
      return this.convertToWebVTT(videoDetails.subtitles);
    } catch (error) {
      console.error("Error fetching YouTube captions:", error);
      throw new Error("Could not fetch captions for the provided video ID.");
    }
  }
  
  private convertToWebVTT(subtitles: any[]): string {
    // WebVTT header
    let webVTT = 'WEBVTT\n\n';
    
    // Convert each subtitle entry to WebVTT format
    subtitles.forEach((subtitle, index) => {
      const { start, dur, text } = subtitle;
      
      // Calculate the end time by adding duration to start time
      const startTime = this.formatTime(parseFloat(start));
      const endTime = this.formatTime(parseFloat(start) + parseFloat(dur));

      // Add cue with timing and text
      webVTT += `${index + 1}\n`;
      webVTT += `${startTime} --> ${endTime}\n`;
      webVTT += `${text}\n\n`;
    });
    
    return webVTT;
  }
  
  private formatTime(seconds: number): string {
    const date = new Date(seconds * 1000);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const secs = date.getUTCSeconds().toString().padStart(2, '0');
    const millisecs = date.getUTCMilliseconds().toString().padStart(3, '0');
    
    return `${hours}:${minutes}:${secs}.${millisecs}`;
  }

  async getVideoInfo(videoId: string): Promise<any> {
    try {
      const response = await this.httpService.axiosRef.get(
        'https://www.googleapis.com/youtube/v3/videos',
        {
          params: {
            part: 'snippet,contentDetails,statistics',
            id: videoId,
            key: 'AIzaSyC1U_sebKpptz3q_uIhmO9UjLmD8nbl4LY',
          },
        }
      );

      const videoInfo = response.data.items[0];
      return videoInfo || null;

    } catch (error) {
      console.error("Error fetching YouTube video info:", error?.response?.data || error);
      throw new Error("Could not fetch video info for the provided video ID.");
    }
  }
}