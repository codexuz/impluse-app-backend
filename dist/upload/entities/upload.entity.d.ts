import { Model } from "sequelize-typescript";
export declare class Upload extends Model<Upload> {
    id: string;
    filename: string;
    original_name: string;
    mime_type: string;
    file_size: number;
    file_path: string;
    uploaded_by?: string;
    upload_type?: string;
    description?: string;
    uploaded_at: Date;
    deleted_at?: Date;
}
