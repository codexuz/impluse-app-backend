import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ConfigService } from "@nestjs/config";
import { Upload } from "./entities/upload.entity.js";
import { CreateUploadDto } from "./dto/create-upload.dto.js";
import { UpdateUploadDto } from "./dto/update-upload.dto.js";
import {
  UploadResponseDto,
  FileListItemDto,
} from "./dto/upload-response.dto.js";
import { Op } from "sequelize";
import { AwsStorageService } from "../aws-storage/aws-storage.service.js";

@Injectable()
export class UploadService {
  private readonly storageBucket = process.env.AWS_BUCKET || "speakup";

  constructor(
    @InjectModel(Upload)
    private uploadModel: typeof Upload,
    private configService: ConfigService,
    private awsStorageService: AwsStorageService,
  ) {
    // Using existing 'speakup' bucket - no need to create
  }

  // Public accessors for controller usage
  getStorageService(): AwsStorageService {
    return this.awsStorageService;
  }

  getStorageBucket(): string {
    return this.storageBucket;
  }

  async getFileUrl(objectName: string): Promise<string> {
    try {
      // Ensure objectName includes uploads/ prefix
      const fullObjectName = objectName.startsWith("uploads/")
        ? objectName
        : `uploads/${objectName}`;

      // Generate a presigned URL valid for 7 days
      const url = await this.awsStorageService.getPresignedUrl(
        this.storageBucket,
        fullObjectName,
        7 * 24 * 60 * 60,
      );
      return url;
    } catch (error) {
      throw new BadRequestException(
        `Failed to generate file URL: ${error.message}`,
      );
    }
  }

  // Database operations
  async create(createUploadDto: CreateUploadDto): Promise<UploadResponseDto> {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = this.getExtensionFromMimeType(createUploadDto.mime_type);
    const filename = `uploads/file-${uniqueSuffix}${extension}`;

    const upload = await this.uploadModel.create({
      ...createUploadDto,
      filename,
      uploaded_at: new Date(),
    });

    return upload.toJSON();
  }

  async findAll(): Promise<UploadResponseDto[]> {
    const uploads = await this.uploadModel.findAll({
      where: {
        deleted_at: { [Op.is]: null },
      },
      order: [["uploaded_at", "DESC"]],
    });

    return uploads.map((upload) => upload.toJSON());
  }

  async findOne(id: string): Promise<UploadResponseDto> {
    const upload = await this.uploadModel.findOne({
      where: {
        id,
        deleted_at: { [Op.is]: null },
      },
    });

    if (!upload) {
      throw new NotFoundException(`Upload with ID ${id} not found`);
    }

    return upload.toJSON();
  }

  async findByUploadedBy(userId: string): Promise<UploadResponseDto[]> {
    const uploads = await this.uploadModel.findAll({
      where: {
        uploaded_by: userId,
        deleted_at: { [Op.is]: null },
      },
      order: [["uploaded_at", "DESC"]],
    });

    return uploads.map((upload) => upload.toJSON());
  }

  async findByType(uploadType: string): Promise<UploadResponseDto[]> {
    const uploads = await this.uploadModel.findAll({
      where: {
        upload_type: uploadType,
        deleted_at: { [Op.is]: null },
      },
      order: [["uploaded_at", "DESC"]],
    });

    return uploads.map((upload) => upload.toJSON());
  }

  async update(
    id: string,
    updateUploadDto: UpdateUploadDto,
  ): Promise<UploadResponseDto> {
    const upload = await this.uploadModel.findOne({
      where: {
        id,
        deleted_at: { [Op.is]: null },
      },
    });

    if (!upload) {
      throw new NotFoundException(`Upload with ID ${id} not found`);
    }

    await upload.update(updateUploadDto);
    return upload.toJSON();
  }

  async remove(id: string): Promise<void> {
    const upload = await this.uploadModel.findOne({
      where: {
        id,
        deleted_at: { [Op.is]: null },
      },
    });

    if (!upload) {
      throw new NotFoundException(`Upload with ID ${id} not found`);
    }

    // Soft delete
    await upload.update({ deleted_at: new Date() });

    // Delete the actual file from AWS S3
    try {
      // Ensure filename includes uploads/ prefix
      const fullObjectName = upload.filename.startsWith("uploads/")
        ? upload.filename
        : `uploads/${upload.filename}`;

      await this.awsStorageService.deleteFile(
        this.storageBucket,
        fullObjectName,
      );
    } catch (error) {
      console.error("Error deleting file from AWS S3:", error);
      // Continue even if file deletion fails
    }
  }

  // File system operations
  async getAllFiles(): Promise<FileListItemDto[]> {
    try {
      const files = await this.awsStorageService.listFiles(
        this.storageBucket,
        "uploads/",
      );
      const fileList: FileListItemDto[] = [];

      for (const file of files) {
        if (file.name) {
          const url = await this.getFileUrl(file.name);
          fileList.push({
            filename: file.name,
            url,
          });
        }
      }

      return fileList;
    } catch (error) {
      throw new BadRequestException(`Failed to list files: ${error.message}`);
    }
  }

  async deleteFile(filename: string) {
    try {
      // Ensure filename includes uploads/ prefix
      const fullObjectName = filename.startsWith("uploads/")
        ? filename
        : `uploads/${filename}`;

      await this.awsStorageService.deleteFile(
        this.storageBucket,
        fullObjectName,
      );
      return { success: true, message: "File deleted successfully" };
    } catch (error) {
      throw new NotFoundException("File not found");
    }
  }

  /**
   * Save base64 data as a file in AWS S3
   * @param base64Data Base64 encoded file content
   * @param customFilename Optional custom filename
   * @returns File details including URL
   */
  async saveBase64File(
    base64Data: string,
    customFilename?: string,
  ): Promise<any> {
    try {
      // Decode the base64 data
      const buffer = Buffer.from(base64Data, "base64");

      // Extract extension from custom filename if provided, otherwise use default
      let extension = ".mp3";
      if (customFilename) {
        const lastDotIndex = customFilename.lastIndexOf(".");
        if (lastDotIndex > 0) {
          extension = customFilename.substring(lastDotIndex);
        }
      }

      // Generate a random filename with uploads/ prefix
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = `uploads/file-${uniqueSuffix}${extension}`;

      // Upload to AWS S3
      await this.awsStorageService.uploadBuffer(
        this.storageBucket,
        filename,
        buffer,
      );

      // Generate presigned URL
      const url = await this.getFileUrl(filename);

      // Return file information
      return {
        filename: filename,
        url: url,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to save base64 file: ${error.message}`,
      );
    }
  }

  /**
   * Helper function to get file extension from MIME type
   */
  private getExtensionFromMimeType(mimeType: string): string {
    const mimeToExt = {
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
      "image/bmp": ".bmp",
      "application/pdf": ".pdf",
      "audio/mpeg": ".mp3",
      "audio/mp3": ".mp3",
      "audio/wav": ".wav",
      "audio/ogg": ".ogg",
      "audio/mp4": ".m4a",
      "audio/x-m4a": ".m4a",
      "video/mp4": ".mp4",
      "video/webm": ".webm",
      "application/json": ".json",
      "text/plain": ".txt",
      "text/html": ".html",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        ".docx",
      "application/msword": ".doc",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        ".xlsx",
      "application/vnd.ms-excel": ".xls",
      "application/zip": ".zip",
    };

    return mimeToExt[mimeType] || ".bin"; // Default to .bin for unknown types
  }
}
