import { Injectable, Logger } from "@nestjs/common";
import * as Minio from "minio";

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private readonly minioClient: Minio.Client;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: parseInt(process.env.MINIO_PORT),
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  }

  getClient(): Minio.Client {
    return this.minioClient;
  }

  async bucketExists(bucketName: string): Promise<boolean> {
    try {
      return await this.minioClient.bucketExists(bucketName);
    } catch (error) {
      this.logger.error(
        `Error checking if bucket ${bucketName} exists:`,
        error
      );
      throw error;
    }
  }

  async makeBucket(bucketName: string, region?: string): Promise<void> {
    try {
      await this.minioClient.makeBucket(bucketName, region);
      this.logger.log(`Bucket ${bucketName} created successfully`);
    } catch (error) {
      this.logger.error(`Error creating bucket ${bucketName}:`, error);
      throw error;
    }
  }

  async uploadFile(
    bucketName: string,
    objectName: string,
    filePath: string,
    metaData?: Record<string, string>
  ): Promise<{ etag: string; versionId?: string }> {
    try {
      const result = await this.minioClient.fPutObject(
        bucketName,
        objectName,
        filePath,
        metaData
      );
      this.logger.log(`File ${objectName} uploaded to ${bucketName}`);
      return result;
    } catch (error) {
      this.logger.error(`Error uploading file ${objectName}:`, error);
      throw error;
    }
  }

  async uploadBuffer(
    bucketName: string,
    objectName: string,
    buffer: Buffer,
    size?: number,
    metaData?: Record<string, string>
  ): Promise<{ etag: string; versionId?: string }> {
    try {
      const result = await this.minioClient.putObject(
        bucketName,
        objectName,
        buffer,
        size,
        metaData
      );
      this.logger.log(`Buffer uploaded as ${objectName} to ${bucketName}`);
      return result;
    } catch (error) {
      this.logger.error(`Error uploading buffer ${objectName}:`, error);
      throw error;
    }
  }

  async downloadFile(bucketName: string, objectName: string): Promise<Buffer> {
    try {
      const stream = await this.minioClient.getObject(bucketName, objectName);
      const chunks: Buffer[] = [];

      return new Promise((resolve, reject) => {
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", (error) => {
          this.logger.error(`Error downloading file ${objectName}:`, error);
          reject(error);
        });
      });
    } catch (error) {
      this.logger.error(`Error getting file ${objectName}:`, error);
      throw error;
    }
  }

  async deleteFile(bucketName: string, objectName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(bucketName, objectName);
      this.logger.log(`File ${objectName} deleted from ${bucketName}`);
    } catch (error) {
      this.logger.error(`Error deleting file ${objectName}:`, error);
      throw error;
    }
  }

  async listFiles(
    bucketName: string,
    prefix?: string,
    recursive?: boolean
  ): Promise<
    Array<{
      name?: string;
      prefix?: string;
      size?: number;
      etag?: string;
      lastModified?: Date;
      versionId?: string;
      isDeleteMarker?: boolean;
    }>
  > {
    try {
      const objectsList: Array<any> = [];
      const stream = this.minioClient.listObjects(
        bucketName,
        prefix,
        recursive
      );

      return new Promise((resolve, reject) => {
        stream.on("data", (obj) => objectsList.push(obj));
        stream.on("end", () => resolve(objectsList));
        stream.on("error", (error) => {
          this.logger.error(`Error listing files in ${bucketName}:`, error);
          reject(error);
        });
      });
    } catch (error) {
      this.logger.error(`Error listing files in bucket ${bucketName}:`, error);
      throw error;
    }
  }

  async getPresignedUrl(
    bucketName: string,
    objectName: string,
    expiry: number = 24 * 60 * 60 // 24 hours by default
  ): Promise<string> {
    try {
      const url = await this.minioClient.presignedGetObject(
        bucketName,
        objectName,
        expiry
      );
      this.logger.log(`Generated presigned URL for ${objectName}`);
      return url;
    } catch (error) {
      this.logger.error(
        `Error generating presigned URL for ${objectName}:`,
        error
      );
      throw error;
    }
  }

  async copyFile(
    sourceBucket: string,
    sourceObject: string,
    destBucket: string,
    destObject: string
  ): Promise<void> {
    try {
      const copyConditions = new Minio.CopyConditions();
      await this.minioClient.copyObject(
        destBucket,
        destObject,
        `${sourceBucket}/${sourceObject}`,
        copyConditions
      );
      this.logger.log(
        `File copied from ${sourceBucket}/${sourceObject} to ${destBucket}/${destObject}`
      );
    } catch (error) {
      this.logger.error(`Error copying file:`, error);
      throw error;
    }
  }
}
