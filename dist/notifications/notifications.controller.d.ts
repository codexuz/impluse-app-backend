import { NotificationsService } from "./notifications.service.js";
import { CreateNotificationDto } from "./dto/create-notification.dto.js";
import { NotificationResponseDto } from "./dto/notification-response.dto.js";
import { OnesignalService } from '../onesignal/onesignal.service.js';
export declare class NotificationsController {
    private readonly notificationsService;
    private readonly onesignalService;
    constructor(notificationsService: NotificationsService, onesignalService: OnesignalService);
    getAllNotifications(): Promise<NotificationResponseDto[]>;
    getNotificationById(id: string): Promise<NotificationResponseDto>;
    createNotificationForAll(createNotificationDto: CreateNotificationDto): Promise<NotificationResponseDto>;
    markSeen(notification_id: string, user_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getUnseen(userId: string): Promise<NotificationResponseDto[]>;
    getAllWithUnseenCount(userId: string): Promise<{
        notifications: NotificationResponseDto[];
        unseenCount: number;
    }>;
    delete(id: string): Promise<void>;
    sendPushNotification(notification: any): Promise<import("@onesignal/node-onesignal").CreateNotificationSuccessResponse>;
}
