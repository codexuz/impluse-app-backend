import { Model } from "sequelize-typescript";
export declare class Messages extends Model {
    id: string;
    chat_group_id: string;
    sender_id: string;
    content: string;
    message_type: string;
    createdAt: Date;
    updatedAt: Date;
}
