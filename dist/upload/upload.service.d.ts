import { ConfigService } from '@nestjs/config';
import { Upload } from './entities/upload.entity.js';
import { CreateUploadDto } from './dto/create-upload.dto.js';
import { UpdateUploadDto } from './dto/update-upload.dto.js';
import { UploadResponseDto, FileListItemDto } from './dto/upload-response.dto.js';
export declare class UploadService {
    private uploadModel;
    private configService;
    private readonly uploadDir;
    constructor(uploadModel: typeof Upload, configService: ConfigService);
    getFileUrl(filename: string): string;
    create(createUploadDto: CreateUploadDto): Promise<UploadResponseDto>;
    findAll(): Promise<UploadResponseDto[]>;
    findOne(id: string): Promise<UploadResponseDto>;
    findByUploadedBy(userId: string): Promise<UploadResponseDto[]>;
    findByType(uploadType: string): Promise<UploadResponseDto[]>;
    update(id: string, updateUploadDto: UpdateUploadDto): Promise<UploadResponseDto>;
    remove(id: string): Promise<void>;
    getAllFiles(): Promise<FileListItemDto[]>;
    deleteFile(filename: string): Promise<{
        success: boolean;
        message: string;
    }>;
    saveBase64File(base64Data: string, customFilename?: string): Promise<any>;
    private getExtensionFromMimeType;
}
