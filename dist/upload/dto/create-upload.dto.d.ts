export declare enum UploadType {
    AUDIO = "audio",
    IMAGE = "image",
    DOCUMENT = "document",
    VIDEO = "video",
    OTHER = "other"
}
export declare class CreateUploadDto {
    original_name: string;
    mime_type: string;
    file_size: number;
    file_path: string;
    uploaded_by?: string;
    upload_type?: UploadType;
    description?: string;
}
