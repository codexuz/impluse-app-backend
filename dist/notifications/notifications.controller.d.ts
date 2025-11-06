import { NotificationsService } from "./notifications.service.js";
import { CreateNotificationDto } from "./dto/create-notification.dto.js";
import { NotificationResponseDto } from "./dto/notification-response.dto.js";
import { CreateNotificationTokenDto } from "./dto/create-notification-token.dto.js";
import { UpdateNotificationTokenDto } from "./dto/update-notification-token.dto.js";
import { NotificationTokenResponseDto } from "./dto/notification-token-response.dto.js";
import { SendAppUpdateDto } from "./dto/send-app-update.dto.js";
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getAllNotifications(): Promise<NotificationResponseDto[]>;
    getNotificationById(id: string): Promise<NotificationResponseDto>;
    createNotificationForAll(createNotificationDto: CreateNotificationDto): Promise<NotificationResponseDto>;
    markSeen(notification_id: string, user_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sendAppUpdate(sendAppUpdateDto: SendAppUpdateDto): Promise<import("firebase-admin/messaging").BatchResponse>;
    getUnseen(userId: string): Promise<NotificationResponseDto[]>;
    getAllWithUnseenCount(userId: string): Promise<{
        notifications: NotificationResponseDto[];
        unseenCount: number;
    }>;
    delete(id: string): Promise<void>;
    createNotificationToken(createDto: CreateNotificationTokenDto): Promise<NotificationTokenResponseDto>;
    getAllNotificationTokens(): Promise<import("./entities/notification-token.entity.js").NotificationToken[]>;
    sendPush(token: string, title: string, body: string, data?: Record<string, string>): Promise<string>;
    sendMulticastPush(tokens: string[], title: string, body: string, data?: Record<string, string>): Promise<import("firebase-admin/messaging").BatchResponse>;
    sendTopicPush(topic: string, title: string, body: string, data?: Record<string, string>): Promise<string>;
    getNotificationTokensByUserId(userId: string): Promise<NotificationTokenResponseDto[]>;
    getNotificationTokenById(id: string): Promise<NotificationTokenResponseDto>;
    updateNotificationToken(id: string, updateDto: UpdateNotificationTokenDto): Promise<NotificationTokenResponseDto>;
    updateNotificationTokenByUserId(userId: string, body: {
        oldToken: string;
        newToken: string;
    }): Promise<NotificationTokenResponseDto>;
    deleteNotificationToken(id: string): Promise<void>;
}
