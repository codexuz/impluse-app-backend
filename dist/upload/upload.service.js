var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { readdir, unlink, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { Upload } from './entities/upload.entity.js';
import { Op } from 'sequelize';
let UploadService = class UploadService {
    constructor(uploadModel, configService) {
        this.uploadModel = uploadModel;
        this.configService = configService;
        this.uploadDir = './uploads';
    }
    getFileUrl(filename) {
        const baseUrl = this.configService.get('APP_URL') || 'https://backend.impulselc.uz';
        return `${baseUrl}/uploads/${filename}`;
    }
    async create(createUploadDto) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = this.getExtensionFromMimeType(createUploadDto.mime_type);
        const filename = `file-${uniqueSuffix}${extension}`;
        const upload = await this.uploadModel.create({
            ...createUploadDto,
            filename,
            uploaded_at: new Date(),
        });
        return upload.toJSON();
    }
    async findAll() {
        const uploads = await this.uploadModel.findAll({
            where: {
                deleted_at: { [Op.is]: null }
            },
            order: [['uploaded_at', 'DESC']]
        });
        return uploads.map(upload => upload.toJSON());
    }
    async findOne(id) {
        const upload = await this.uploadModel.findOne({
            where: {
                id,
                deleted_at: { [Op.is]: null }
            }
        });
        if (!upload) {
            throw new NotFoundException(`Upload with ID ${id} not found`);
        }
        return upload.toJSON();
    }
    async findByUploadedBy(userId) {
        const uploads = await this.uploadModel.findAll({
            where: {
                uploaded_by: userId,
                deleted_at: { [Op.is]: null }
            },
            order: [['uploaded_at', 'DESC']]
        });
        return uploads.map(upload => upload.toJSON());
    }
    async findByType(uploadType) {
        const uploads = await this.uploadModel.findAll({
            where: {
                upload_type: uploadType,
                deleted_at: { [Op.is]: null }
            },
            order: [['uploaded_at', 'DESC']]
        });
        return uploads.map(upload => upload.toJSON());
    }
    async update(id, updateUploadDto) {
        const upload = await this.uploadModel.findOne({
            where: {
                id,
                deleted_at: { [Op.is]: null }
            }
        });
        if (!upload) {
            throw new NotFoundException(`Upload with ID ${id} not found`);
        }
        await upload.update(updateUploadDto);
        return upload.toJSON();
    }
    async remove(id) {
        const upload = await this.uploadModel.findOne({
            where: {
                id,
                deleted_at: { [Op.is]: null }
            }
        });
        if (!upload) {
            throw new NotFoundException(`Upload with ID ${id} not found`);
        }
        await upload.update({ deleted_at: new Date() });
        try {
            await unlink(join(this.uploadDir, upload.filename));
        }
        catch (error) {
            console.error('Error deleting physical file:', error);
        }
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
    async saveBase64File(base64Data, customFilename) {
        try {
            if (!existsSync(this.uploadDir)) {
                await mkdir(this.uploadDir, { recursive: true });
            }
            const buffer = Buffer.from(base64Data, 'base64');
            let extension = '.mp3';
            if (customFilename) {
                const lastDotIndex = customFilename.lastIndexOf('.');
                if (lastDotIndex > 0) {
                    extension = customFilename.substring(lastDotIndex);
                }
            }
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const filename = `file-${uniqueSuffix}${extension}`;
            const filepath = join(this.uploadDir, filename);
            await writeFile(filepath, buffer);
            return {
                filename: filename,
                path: filepath,
                url: this.getFileUrl(filename)
            };
        }
        catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException(`Failed to save base64 file: ${error.message}`);
        }
    }
    getExtensionFromMimeType(mimeType) {
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
        return mimeToExt[mimeType] || '.bin';
    }
};
UploadService = __decorate([
    Injectable(),
    __param(0, InjectModel(Upload)),
    __metadata("design:paramtypes", [Object, ConfigService])
], UploadService);
export { UploadService };
//# sourceMappingURL=upload.service.js.map