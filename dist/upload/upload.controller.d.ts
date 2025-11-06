import { UploadService } from "./upload.service.js";
import { Base64UploadDto } from "./dto/base64-upload.dto.js";
import { CreateUploadDto } from "./dto/create-upload.dto.js";
import { UpdateUploadDto } from "./dto/update-upload.dto.js";
import { UploadResponseDto, FileListItemDto } from "./dto/upload-response.dto.js";
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFile(file: Express.Multer.File): {
        originalName: string;
        filename: string;
        path: string;
        url: string;
    };
    getAllFiles(): Promise<FileListItemDto[]>;
    deleteFile(filename: string): Promise<{
        success: boolean;
        message: string;
    }>;
    uploadBase64File(base64UploadDto: Base64UploadDto): Promise<any>;
    createUploadRecord(createUploadDto: CreateUploadDto): Promise<UploadResponseDto>;
    getAllUploadRecords(): Promise<UploadResponseDto[]>;
    getUploadRecord(id: string): Promise<UploadResponseDto>;
    getUploadsByUser(userId: string): Promise<UploadResponseDto[]>;
    getUploadsByType(uploadType: string): Promise<UploadResponseDto[]>;
    updateUploadRecord(id: string, updateUploadDto: UpdateUploadDto): Promise<UploadResponseDto>;
    deleteUploadRecord(id: string): Promise<void>;
}
