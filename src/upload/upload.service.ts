import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ConfigService } from "@nestjs/config";
import { readdir, unlink, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { Upload } from "./entities/upload.entity.js";
import { CreateUploadDto } from "./dto/create-upload.dto.js";
import { UpdateUploadDto } from "./dto/update-upload.dto.js";
import {
  UploadResponseDto,
  FileListItemDto,
} from "./dto/upload-response.dto.js";
import { Op } from "sequelize";

@Injectable()
export class UploadService {
  private readonly uploadDir = "./uploads";

  constructor(
    @InjectModel(Upload)
    private uploadModel: typeof Upload,
    private configService: ConfigService
  ) {
    this.ensureUploadDirectories();
  }

  private async ensureUploadDirectories() {
    const directories = [
      "./uploads",
      "./uploads/videos",
      "./uploads/avatars",
      "./uploads/temp",
    ];
    for (const dir of directories) {
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }
    }
  }

  getFileUrl(filename: string): string {
    const baseUrl =
      this.configService.get("APP_URL") || "https://backend.impulselc.uz";
    // Handle both regular uploads and video uploads
    if (filename.includes("/")) {
      return `${baseUrl}/uploads/${filename}`;
    }
    return `${baseUrl}/uploads/${filename}`;
  }

  // Database operations
  async create(createUploadDto: CreateUploadDto): Promise<UploadResponseDto> {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = this.getExtensionFromMimeType(createUploadDto.mime_type);
    const filename = `file-${uniqueSuffix}${extension}`;

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
    updateUploadDto: UpdateUploadDto
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

    // Optionally delete the actual file
    try {
      await unlink(join(this.uploadDir, upload.filename));
    } catch (error) {
      console.error("Error deleting physical file:", error);
      // Continue even if file deletion fails
    }
  }

  // File system operations
  async getAllFiles(): Promise<FileListItemDto[]> {
    const files = await readdir(this.uploadDir);
    return files.map((filename) => ({
      filename,
      url: this.getFileUrl(filename),
    }));
  }

  async deleteFile(filename: string) {
    try {
      await unlink(join(this.uploadDir, filename));
      return { success: true, message: "File deleted successfully" };
    } catch (error) {
      throw new NotFoundException("File not found");
    }
  }

  /**
   * Save base64 data as a file
   * @param base64Data Base64 encoded file content
   * @param customFilename Optional custom filename
   * @returns File details including URL
   */
  async saveBase64File(
    base64Data: string,
    customFilename?: string
  ): Promise<any> {
    try {
      // Ensure upload directory exists
      if (!existsSync(this.uploadDir)) {
        await mkdir(this.uploadDir, { recursive: true });
      }

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

      // Always generate a random filename
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = `file-${uniqueSuffix}${extension}`;
      const filepath = join(this.uploadDir, filename);

      // Write the file to disk
      await writeFile(filepath, buffer);

      // Return file information
      return {
        filename: filename,
        path: filepath,
        url: this.getFileUrl(filename),
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to save base64 file: ${error.message}`
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
