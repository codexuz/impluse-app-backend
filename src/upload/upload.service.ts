import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readdir, unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class UploadService {
  private readonly uploadDir = './uploads';

  constructor(private configService: ConfigService) {}

  getFileUrl(filename: string): string {
    const baseUrl = this.configService.get('APP_URL') || 'https://app.impulselc.uz';
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
}
