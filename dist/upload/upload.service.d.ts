import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private configService;
    private readonly uploadDir;
    constructor(configService: ConfigService);
    getFileUrl(filename: string): string;
    getAllFiles(): Promise<{
        filename: string;
        url: string;
    }[]>;
    deleteFile(filename: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
