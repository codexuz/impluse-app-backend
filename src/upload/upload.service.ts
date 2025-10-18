import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readdir, unlink, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class UploadService {
  private readonly uploadDir = './uploads';

  constructor(private configService: ConfigService) {}

  getFileUrl(filename: string): string {
    const baseUrl = this.configService.get('APP_URL') || 'https://backend.impulselc.uz';
    return `${baseUrl}/uploads/${filename}`;
  }

  async getAllFiles() {
    const files = await readdir(this.uploadDir);
    return files.map(filename => ({
      filename,
      url: this.getFileUrl(filename)
    }));
  }

  async deleteFile(filename: string) {
    try {
      await unlink(join(this.uploadDir, filename));
      return { success: true, message: 'File deleted successfully' };
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }
  
  /**
   * Save base64 data as a file
   * @param base64Data Base64 encoded file with mime type (data:[mimetype];base64,[data])
   * @param customFilename Optional custom filename
   * @returns File details including URL
   */
  async saveBase64File(base64Data: string, customFilename?: string): Promise<any> {
    try {
      // Ensure upload directory exists
      if (!existsSync(this.uploadDir)) {
        await mkdir(this.uploadDir, { recursive: true });
      }
      
      // Parse the base64 string to get the mime type and raw data
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      
      if (!matches || matches.length !== 3) {
        throw new BadRequestException('Invalid base64 format');
      }
      
      // Extract the mime type and data
      const mimeType = matches[1];
      const base64Content = matches[2];
      
      // Decode the base64 data
      const buffer = Buffer.from(base64Content, 'base64');
      
      // Determine file extension from MIME type
      const extension = this.getExtensionFromMimeType(mimeType);
      
      // Generate filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = customFilename || `file-${uniqueSuffix}${extension}`;
      const filepath = join(this.uploadDir, filename);
      
      // Write the file to disk
      await writeFile(filepath, buffer);
      
      // Return file information
      return {
        originalMimeType: mimeType,
        filename: filename,
        path: filepath,
        url: this.getFileUrl(filename)
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to save base64 file: ${error.message}`);
    }
  }
  
  /**
   * Helper function to get file extension from MIME type
   */
  private getExtensionFromMimeType(mimeType: string): string {
    const mimeToExt = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/bmp': '.bmp',
      'application/pdf': '.pdf',
      'audio/mpeg': '.mp3',
      'audio/mp3': '.mp3',
      'audio/wav': '.wav',
      'audio/ogg': '.ogg',
      'audio/mp4': '.m4a',
      'audio/x-m4a': '.m4a',
      'video/mp4': '.mp4',
      'video/webm': '.webm',
      'application/json': '.json',
      'text/plain': '.txt',
      'text/html': '.html',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
      'application/vnd.ms-excel': '.xls',
      'application/zip': '.zip'
    };
    
    return mimeToExt[mimeType] || '.bin'; // Default to .bin for unknown types
  }
}
