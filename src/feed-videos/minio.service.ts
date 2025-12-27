import { Injectable, Logger } from "@nestjs/common";
import * as Minio from "minio";
import { Readable } from "stream";

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private minioClient: Minio.Client;
  private readonly bucketName = "feed-videos";
  private readonly endPoint = "minio.impulselc.uz";
  private readonly port = 443;
  private readonly useSSL = true;

  constructor() {
    // Initialize MinIO client
    this.minioClient = new Minio.Client({
      endPoint: this.endPoint,
      port: this.port,
      useSSL: this.useSSL,
      accessKey: "P4KU05nCU4FeEvFX",
      secretKey: "HVD6d5FCReJxVsmxS6cD4L944r9wt6Ts",
    });

    // Ensure bucket exists on initialization
    this.initializeBucket();
  }

  /**
   * Initialize bucket - create if doesn't exist
   */
  private async initializeBucket() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (exists) {
        this.logger.log(`Bucket "${this.bucketName}" already exists.`);
      } else {
        await this.minioClient.makeBucket(this.bucketName, "us-east-1");
        this.logger.log(`Bucket "${this.bucketName}" created successfully.`);
      }
    } catch (error) {
      this.logger.error(`Error initializing bucket: ${error.message}`);
      throw error;
    }
  }

  /**
   * Upload video file to MinIO
   * @param file - Express.Multer.File object
   * @param fileName - Custom file name (optional)
   * @returns Object with file URL and metadata
   */
  async uploadVideo(
    file: Express.Multer.File,
    fileName?: string
  ): Promise<{ url: string; fileName: string; size: number }> {
    try {
      const objectName =
        fileName || `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;

      const metaData = {
        "Content-Type": file.mimetype,
        "X-Amz-Meta-Original-Name": file.originalname,
      };

      // Upload from buffer
      await this.minioClient.putObject(
        this.bucketName,
        objectName,
        file.buffer,
        file.size,
        metaData
      );

      const url = await this.getVideoUrl(objectName);

      this.logger.log(`Video uploaded successfully: ${objectName}`);

      return {
        url,
        fileName: objectName,
        size: file.size,
      };
    } catch (error) {
      this.logger.error(`Error uploading video: ${error.message}`);
      throw error;
    }
  }

  /**
   * Upload video from stream
   * @param stream - Readable stream
   * @param fileName - File name
   * @param size - File size
   * @param mimetype - MIME type
   */
  async uploadVideoStream(
    stream: Readable,
    fileName: string,
    size: number,
    mimetype: string
  ): Promise<{ url: string; fileName: string; size: number }> {
    try {
      const objectName = `${Date.now()}-${fileName.replace(/\s+/g, "-")}`;

      const metaData = {
        "Content-Type": mimetype,
        "X-Amz-Meta-Original-Name": fileName,
      };

      await this.minioClient.putObject(
        this.bucketName,
        objectName,
        stream,
        size,
        metaData
      );

      const url = await this.getVideoUrl(objectName);

      this.logger.log(`Video stream uploaded successfully: ${objectName}`);

      return {
        url,
        fileName: objectName,
        size,
      };
    } catch (error) {
      this.logger.error(`Error uploading video stream: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get presigned video URL (expires in X seconds)
   * @param fileName - Name of the file in MinIO
   * @param expirySeconds - Expiry time in seconds (default: 7 days)
   * @returns Presigned URL to access the video
   */
  async getVideoUrl(
    fileName: string,
    expirySeconds: number = 7 * 24 * 60 * 60
  ): Promise<string> {
    try {
      const url = await this.minioClient.presignedGetObject(
        this.bucketName,
        fileName,
        expirySeconds
      );
      return url;
    } catch (error) {
      this.logger.error(`Error generating presigned URL: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete video from MinIO
   * @param fileName - Name of the file to delete
   */
  async deleteVideo(fileName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, fileName);
      this.logger.log(`Video deleted successfully: ${fileName}`);
    } catch (error) {
      this.logger.error(`Error deleting video: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if video exists
   * @param fileName - Name of the file
   */
  async videoExists(fileName: string): Promise<boolean> {
    try {
      await this.minioClient.statObject(this.bucketName, fileName);
      return true;
    } catch (error) {
      if (error.code === "NotFound") {
        return false;
      }
      throw error;
    }
  }

  /**
   * Get video metadata
   * @param fileName - Name of the file
   */
  async getVideoMetadata(fileName: string): Promise<any> {
    try {
      const stat = await this.minioClient.statObject(this.bucketName, fileName);
      return stat;
    } catch (error) {
      this.logger.error(`Error getting video metadata: ${error.message}`);
      throw error;
    }
  }

  /**
   * List all videos in bucket
   * @param prefix - Optional prefix filter
   */
  async listVideos(prefix?: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const videos: any[] = [];
      const stream = this.minioClient.listObjects(
        this.bucketName,
        prefix,
        true
      );

      stream.on("data", (obj) => videos.push(obj));
      stream.on("error", (err) => reject(err));
      stream.on("end", () => resolve(videos));
    });
  }
}
