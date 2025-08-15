import { Model } from "sequelize-typescript";
interface NotificationCreationAttrs {
    title: string;
    message: string;
    img_url?: string;
}
export declare class Notifications extends Model<Notifications, NotificationCreationAttrs> {
    id: string;
    title: string;
    message: string;
    img_url: string;
    createdAt: Date;
    updatedAt: Date;
}
export {};
