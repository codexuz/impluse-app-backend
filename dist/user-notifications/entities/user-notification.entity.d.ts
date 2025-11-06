import { Model } from 'sequelize-typescript';
export declare class UserNotification extends Model {
    id: string;
    user_id: string;
    notification_id: string;
    seen: boolean;
    createdAt: Date;
    updatedAt: Date;
}
