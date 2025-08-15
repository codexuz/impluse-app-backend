import { UploadService } from './upload.service.js';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFile(file: Express.Multer.File): {
        originalName: string;
        filename: string;
        path: string;
        url: string;
    };
    getAllFiles(): Promise<{
        filename: string;
        url: string;
    }[]>;
    deleteFile(filename: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
