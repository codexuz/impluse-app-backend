import { CreateNotificationDto } from './dto/create-notification.dto.js';
import { NotificationResponseDto } from './dto/notification-response.dto.js';
export declare class NotificationsService {
    getAllNotifications(): Promise<NotificationResponseDto[]>;
    createNotificationForAllUsers(createNotificationDto: CreateNotificationDto): Promise<NotificationResponseDto>;
    markNotificationSeen(params: {
        notification_id: string;
        user_id: string;
    }): Promise<void>;
    getUnseenNotifications(user_id: string): Promise<NotificationResponseDto[]>;
    getAllNotificationsWithUnseenCount(user_id: string): Promise<{
        notifications: NotificationResponseDto[];
        unseenCount: number;
    }>;
    deleteNotification(notification_id: string): Promise<void>;
    getNotificationById(id: string): Promise<NotificationResponseDto>;
}
