import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  ListObjectsV2Command,
  paginateListObjectsV2,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AwsStorageService {
  private readonly logger = new Logger(AwsStorageService.name);
  private readonly s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>("AWS_REGION"),
      endpoint: this.configService.get<string>("AWS_ENDPOINT"),
      credentials: {
        accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID"),
        secretAccessKey: this.configService.get<string>(
          "AWS_SECRET_ACCESS_KEY",
        ),
      },
    });
  }

  getClient(): S3Client {
    return this.s3Client;
  }

  async bucketExists(bucketName: string): Promise<boolean> {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
      return true;
    } catch (error) {
      if (error.name === "NotFound") {
        return false;
      }
      this.logger.error(
        `Error checking if bucket ${bucketName} exists:`,
        error,
      );
      throw error;
    }
  }

  async makeBucket(bucketName: string): Promise<void> {
    try {
      await this.s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
      this.logger.log(`Bucket ${bucketName} created successfully`);
    } catch (error) {
      this.logger.error(`Error creating bucket ${bucketName}:`, error);
      throw error;
    }
  }

  async uploadBuffer(
    bucketName: string,
    objectName: string,
    buffer: Buffer,
    contentType?: string,
    isPublic: boolean = true,
  ): Promise<{ etag: string }> {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: objectName,
        Body: buffer,
        ContentType: contentType,
        ...(isPublic && { ACL: "public-read" }),
      });

      const result = await this.s3Client.send(command);
      this.logger.log(`Buffer uploaded as ${objectName} to ${bucketName}`);
      return { etag: result.ETag };
    } catch (error) {
      this.logger.error(`Error uploading buffer ${objectName}:`, error);
      throw error;
    }
  }

  async downloadFile(bucketName: string, objectName: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: objectName,
      });

      const response = await this.s3Client.send(command);
      const stream = response.Body;

      // Convert stream to buffer
      const chunks: Uint8Array[] = [];
      for await (const chunk of stream as any) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } catch (error) {
      this.logger.error(`Error downloading file ${objectName}:`, error);
      throw error;
    }
  }

  async deleteFile(bucketName: string, objectName: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: objectName,
      });

      await this.s3Client.send(command);
      this.logger.log(`File ${objectName} deleted from ${bucketName}`);
    } catch (error) {
      this.logger.error(`Error deleting file ${objectName}:`, error);
      throw error;
    }
  }

  async listFiles(
    bucketName: string,
    prefix?: string,
  ): Promise<Array<{ name: string; size: number; lastModified: Date }>> {
    try {
      const files: Array<{ name: string; size: number; lastModified: Date }> =
        [];

      const paginator = paginateListObjectsV2(
        { client: this.s3Client },
        { Bucket: bucketName, Prefix: prefix },
      );

      for await (const page of paginator) {
        if (page.Contents) {
          for (const object of page.Contents) {
            if (object.Key) {
              files.push({
                name: object.Key,
                size: object.Size || 0,
                lastModified: object.LastModified || new Date(),
              });
            }
          }
        }
      }

      return files;
    } catch (error) {
      this.logger.error(`Error listing files in bucket ${bucketName}:`, error);
      throw error;
    }
  }

  async getPresignedUrl(
    bucketName: string,
    objectName: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: objectName,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      return url;
    } catch (error) {
      this.logger.error(
        `Error generating presigned URL for ${objectName}:`,
        error,
      );
      throw error;
    }
  }

  async fileExists(bucketName: string, objectName: string): Promise<boolean> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: objectName,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      if (error.name === "NoSuchKey") {
        return false;
      }
      throw error;
    }
  }
}
