import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Logger, Inject } from "@nestjs/common";
import { Job } from "bullmq";
import ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import * as path from "path";

export interface VideoCompressionJobData {
  inputPath: string;
  outputPath: string;
  userId: number;
  videoId?: number;
  originalFilename: string;
}

export interface CompressionProgress {
  percent: number;
  currentFps: number;
  currentKbps: number;
  targetSize: number;
  timemark: string;
}

@Processor("video-compression", {
  concurrency: 2, // Process 2 videos at a time
})
export class VideoCompressionProcessor extends WorkerHost {
  private readonly logger = new Logger(VideoCompressionProcessor.name);

  constructor(
    @Inject("FeedVideosService")
    private feedVideosService: any
  ) {
    super();
  }

  async process(job: Job<VideoCompressionJobData>): Promise<any> {
    const { inputPath, outputPath, userId, videoId, originalFilename } =
      job.data;

    // Normalize paths for cross-platform compatibility
    const normalizedInputPath = path.resolve(inputPath);
    const normalizedOutputPath = path.resolve(outputPath);

    this.logger.log(
      `Starting compression for job ${job.id} - User: ${userId}, File: ${originalFilename}`
    );
    this.logger.log(`Input path: ${normalizedInputPath}`);
    this.logger.log(`Output path: ${normalizedOutputPath}`);

    try {
      // Validate input file exists
      if (!fs.existsSync(normalizedInputPath)) {
        throw new Error(`Input file does not exist: ${normalizedInputPath}`);
      }

      // Ensure output directory exists
      const outputDir = path.dirname(normalizedOutputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Get video metadata first
      const metadata = await this.getVideoMetadata(normalizedInputPath);

      await job.updateProgress({
        percent: 0,
        status: "starting",
        message: "Initializing compression...",
      });

      // Compress video with Instagram-like settings
      await this.compressVideo(
        normalizedInputPath,
        normalizedOutputPath,
        job,
        metadata
      );

      await job.updateProgress({
        percent: 100,
        status: "completed",
        message: "Compression completed successfully",
      });

      // Clean up input file
      if (fs.existsSync(normalizedInputPath)) {
        fs.unlinkSync(normalizedInputPath);
        this.logger.log(`Cleaned up input file: ${normalizedInputPath}`);
      }

      const result = {
        success: true,
        outputPath: normalizedOutputPath,
        videoId,
        userId,
        compressedSize: fs.statSync(normalizedOutputPath).size,
        originalSize: metadata.size,
      };

      // Update video record in database if videoId exists
      if (videoId) {
        try {
          await this.feedVideosService.updateVideoAfterCompression(
            videoId,
            normalizedOutputPath,
            result.compressedSize
          );
          this.logger.log(`Updated video ${videoId} with compressed URL`);
        } catch (error) {
          this.logger.error(`Failed to update video ${videoId}:`, error);
        }
      }

      return result;
    } catch (error) {
      this.logger.error(`Compression failed for job ${job.id}:`, error);

      // Clean up files on error
      if (fs.existsSync(normalizedInputPath)) {
        fs.unlinkSync(normalizedInputPath);
      }
      if (fs.existsSync(normalizedOutputPath)) {
        fs.unlinkSync(normalizedOutputPath);
      }

      throw error;
    }
  }

  private getVideoMetadata(inputPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          const videoStream = metadata.streams.find(
            (stream) => stream.codec_type === "video"
          );
          resolve({
            duration: metadata.format.duration,
            size: metadata.format.size,
            width: videoStream?.width,
            height: videoStream?.height,
            bitrate: metadata.format.bit_rate,
          });
        }
      });
    });
  }

  private compressVideo(
    inputPath: string,
    outputPath: string,
    job: Job<VideoCompressionJobData>,
    metadata: any
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Instagram-like compression settings
      const command = ffmpeg(inputPath)
        .outputOptions([
          // Video codec settings
          "-vcodec libx264",
          "-preset medium", // Balance between speed and compression
          "-crf 23", // Instagram-like quality (18-28, lower = better quality)

          // Audio codec settings
          "-acodec aac",
          "-b:a 128k", // Audio bitrate
          "-ar 44100", // Audio sample rate

          // Profile and level for compatibility
          "-profile:v main",
          "-level 4.0",

          // Optimize for web streaming
          "-movflags +faststart",

          // Pixel format for compatibility
          "-pix_fmt yuv420p",

          // Max resolution (1080p like Instagram)
          "-vf scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease",

          // Frame rate limit
          "-r 30",

          // Max video bitrate (Instagram uses ~3.5 Mbps for 1080p)
          "-maxrate 3500k",
          "-bufsize 7000k",
        ])
        .on("start", (commandLine) => {
          this.logger.debug(`FFmpeg command: ${commandLine}`);
        })
        .on("progress", async (progress: any) => {
          // Calculate percentage based on time processed
          const percent = metadata.duration
            ? Math.min(
                Math.round(
                  ((progress.timemark
                    ? this.timemarkToSeconds(progress.timemark)
                    : 0) /
                    metadata.duration) *
                    100
                ),
                99
              )
            : 0;

          await job.updateProgress({
            percent,
            currentFps: progress.currentFps || 0,
            currentKbps: progress.currentKbps || 0,
            timemark: progress.timemark || "00:00:00",
            status: "processing",
            message: `Compressing video: ${percent}%`,
          });

          this.logger.debug(
            `Job ${job.id} progress: ${percent}% - ${progress.timemark}`
          );
        })
        .on("end", () => {
          this.logger.log(`Compression completed for job ${job.id}`);
          resolve();
        })
        .on("error", (err, stdout, stderr) => {
          this.logger.error(`FFmpeg error for job ${job.id}:`, err);
          this.logger.error("FFmpeg stderr:", stderr);
          reject(err);
        })
        .save(outputPath);
    });
  }

  private timemarkToSeconds(timemark: string): number {
    const parts = timemark.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseFloat(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
  }

  @OnWorkerEvent("completed")
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed successfully`);
  }

  @OnWorkerEvent("failed")
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed:`, error);
  }

  @OnWorkerEvent("active")
  onActive(job: Job) {
    this.logger.log(`Job ${job.id} is now active`);
  }
}
