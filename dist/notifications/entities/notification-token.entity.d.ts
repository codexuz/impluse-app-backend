import { Model } from "sequelize-typescript";
interface NotificationTokenCreationAttrs {
    token: string;
    user_id?: string;
}
export declare class NotificationToken extends Model<NotificationToken, NotificationTokenCreationAttrs> {
    id: string;
    user_id: string;
    token: string;
    createdAt: Date;
    updatedAt: Date;
}
export {};
