import { CreateNotificationDto } from "./dto/create-notification.dto.js";
import { NotificationResponseDto } from "./dto/notification-response.dto.js";
import { CreateNotificationTokenDto } from "./dto/create-notification-token.dto.js";
import { UpdateNotificationTokenDto } from "./dto/update-notification-token.dto.js";
import { NotificationTokenResponseDto } from "./dto/notification-token-response.dto.js";
import { NotificationToken } from "./entities/notification-token.entity.js";
import { FirebaseServiceService } from "./firebase-service.service.js";
export declare class NotificationsService {
    private readonly firebaseService;
    constructor(firebaseService: FirebaseServiceService);
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
    createNotificationToken(createDto: CreateNotificationTokenDto): Promise<NotificationTokenResponseDto>;
    findAllNotificationTokens(): Promise<NotificationToken[]>;
    findNotificationTokensByUserId(userId: string): Promise<NotificationTokenResponseDto[]>;
    notifyUser(deviceToken: string, title?: string, body?: string, data?: Record<string, string>): Promise<string>;
    notifyMultipleUsers(tokens: string[], title?: string, body?: string, data?: Record<string, string>): Promise<import("firebase-admin/messaging").BatchResponse>;
    notifyTopic(topic: string, title?: string, body?: string, data?: Record<string, string>): Promise<string>;
    sendAppUpdateNotification(options?: {
        customMessage?: string;
        playStoreUrl?: string;
    }): Promise<import("firebase-admin/messaging").BatchResponse>;
    findNotificationTokenById(id: string): Promise<NotificationTokenResponseDto>;
    updateNotificationToken(id: string, updateDto: UpdateNotificationTokenDto): Promise<NotificationTokenResponseDto>;
    updateNotificationTokenByUserId(userId: string, oldToken: string, updateDto: UpdateNotificationTokenDto): Promise<NotificationTokenResponseDto>;
    deleteNotificationToken(id: string): Promise<void>;
}
