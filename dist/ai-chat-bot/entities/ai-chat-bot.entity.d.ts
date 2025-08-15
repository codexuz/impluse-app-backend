import { Model } from "sequelize-typescript";
export declare class chatHistory extends Model<chatHistory> {
    id: string;
    userId: string;
    role: string;
    content: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
