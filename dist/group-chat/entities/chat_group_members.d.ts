import { Model } from "sequelize-typescript";
export declare class GroupChatMembers extends Model {
    id: string;
    chat_group_id: string;
    user_id: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}
