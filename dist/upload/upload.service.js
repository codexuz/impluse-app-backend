var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readdir, unlink } from 'fs/promises';
import { join } from 'path';
let UploadService = class UploadService {
    constructor(configService) {
        this.configService = configService;
        this.uploadDir = './uploads';
    }
    getFileUrl(filename) {
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
    async deleteFile(filename) {
        try {
            await unlink(join(this.uploadDir, filename));
            return { success: true, message: 'File deleted successfully' };
        }
        catch (error) {
            throw new NotFoundException('File not found');
        }
    }
};
UploadService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], UploadService);
export { UploadService };
//# sourceMappingURL=upload.service.js.map