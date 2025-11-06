var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, BadRequestException, NotFoundException, } from "@nestjs/common";
import { Notifications } from "./entities/notification.entity.js";
import { UserNotification } from "../user-notifications/entities/user-notification.entity.js";
import { User } from "../users/entities/user.entity.js";
import { NotificationToken } from "./entities/notification-token.entity.js";
import { FirebaseServiceService } from "./firebase-service.service.js";
import { Op } from "sequelize";
let NotificationsService = class NotificationsService {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async getAllNotifications() {
        const notifications = await Notifications.findAll({
            order: [["createdAt", "DESC"]],
        });
        return notifications;
    }
    async createNotificationForAllUsers(createNotificationDto) {
        const notification = await Notifications.create(createNotificationDto);
        const users = await User.findAll();
        const records = users.map((user) => ({
            user_id: user.user_id,
            notification_id: notification.id,
            seen: false,
        }));
        await UserNotification.bulkCreate(records);
        console.log(records);
        try {
            const notificationTokens = await NotificationToken.findAll({
                where: {
                    user_id: users.map(user => user.user_id)
                }
            });
            if (notificationTokens.length > 0) {
                const tokens = notificationTokens.map(nt => nt.token);
                await this.notifyMultipleUsers(tokens, createNotificationDto.title || 'New Notification', createNotificationDto.message, {
                    notification_id: notification.id,
                    img_url: createNotificationDto.img_url,
                    type: 'global'
                });
            }
        }
        catch (error) {
            console.error('Error sending push notifications:', error);
        }
        return notification;
    }
    async markNotificationSeen(params) {
        const { notification_id, user_id } = params;
        if (!notification_id || !user_id) {
            throw new BadRequestException("notification_id and user_id are required");
        }
        const notification = await Notifications.findByPk(notification_id);
        if (!notification) {
            throw new BadRequestException(`Notification with ID ${notification_id} not found`);
        }
        const userNotification = await UserNotification.findOne({
            where: {
                notification_id,
                user_id,
            },
        });
        if (!userNotification) {
            throw new BadRequestException(`User notification not found for user ${user_id} and notification ${notification_id}`);
        }
        await UserNotification.update({ seen: true }, {
            where: {
                notification_id,
                user_id,
            },
        });
    }
    async getUnseenNotifications(user_id) {
        return await Notifications.findAll({
            include: [
                {
                    model: UserNotification,
                    as: "user_notifications",
                    where: { user_id, seen: false },
                    attributes: [],
                },
            ],
            order: [["createdAt", "DESC"]],
        });
    }
    async getAllNotificationsWithUnseenCount(user_id) {
        const notifications = await Notifications.findAll({
            include: [
                {
                    model: UserNotification,
                    as: "user_notifications",
                    where: { user_id },
                },
            ],
            order: [["createdAt", "DESC"]],
        });
        const unseenCount = await UserNotification.count({
            where: { user_id, seen: false },
        });
        return {
            notifications,
            unseenCount,
        };
    }
    async deleteNotification(notification_id) {
        await UserNotification.destroy({
            where: { notification_id },
        });
        await Notifications.destroy({
            where: { id: notification_id },
        });
    }
    async getNotificationById(id) {
        return await Notifications.findByPk(id);
    }
    async createNotificationToken(createDto) {
        try {
            const existingToken = await NotificationToken.findOne({
                where: { user_id: createDto.user_id },
            });
            if (existingToken) {
                await existingToken.update({ token: createDto.token });
                return existingToken;
            }
            else {
                return await NotificationToken.create(createDto);
            }
        }
        catch (error) {
            console.error("Error creating/updating notification token:", error);
            throw error;
        }
    }
    async findAllNotificationTokens() {
        try {
            return await NotificationToken.findAll({
                include: [{
                        model: User,
                        as: 'user',
                        attributes: ['user_id', 'username', 'first_name', 'last_name', 'level_id']
                    }],
                order: [['createdAt', 'DESC']]
            });
        }
        catch (error) {
            console.error("Error fetching notification tokens:", error);
            throw error;
        }
    }
    async findNotificationTokensByUserId(userId) {
        return await NotificationToken.findAll({
            where: { user_id: userId },
            order: [["createdAt", "DESC"]],
        });
    }
    async notifyUser(deviceToken, title, body, data) {
        return this.firebaseService.sendNotification(deviceToken, title || 'Hello!', body || 'This is a test push notification 🚀', data || { customData: '12345' });
    }
    async notifyMultipleUsers(tokens, title, body, data) {
        return this.firebaseService.sendMulticastNotification(tokens, title || 'Hello!', body || 'This is a test push notification 🚀', data || { customData: '12345' });
    }
    async notifyTopic(topic, title, body, data) {
        return this.firebaseService.sendToTopic(topic, title || 'Hello!', body || 'This is a test push notification 🚀', data || { customData: '12345' });
    }
    async sendAppUpdateNotification(options) {
        try {
            const notificationTokens = await NotificationToken.findAll({
                where: {
                    user_id: { [Op.not]: null }
                }
            });
            const tokens = notificationTokens.map(nt => nt.token);
            if (tokens.length === 0) {
                console.log('No tokens found to send app update notification');
                return;
            }
            return await this.firebaseService.sendAppUpdateNotification(tokens, options?.customMessage, options?.playStoreUrl);
        }
        catch (error) {
            console.error('Error sending app update notification:', error);
            throw error;
        }
    }
    async findNotificationTokenById(id) {
        const token = await NotificationToken.findByPk(id);
        if (!token) {
            throw new NotFoundException(`Notification token with ID ${id} not found`);
        }
        return token;
    }
    async updateNotificationToken(id, updateDto) {
        const token = await this.findNotificationTokenById(id);
        await NotificationToken.update(updateDto, {
            where: { id },
        });
        return await this.findNotificationTokenById(id);
    }
    async updateNotificationTokenByUserId(userId, oldToken, updateDto) {
        const token = await NotificationToken.findOne({
            where: {
                user_id: userId,
                token: oldToken,
            },
        });
        if (!token) {
            throw new NotFoundException(`Notification token not found for user ${userId} with token ${oldToken}`);
        }
        await NotificationToken.update(updateDto, {
            where: {
                user_id: userId,
                token: oldToken,
            },
        });
        return await NotificationToken.findOne({
            where: {
                user_id: userId,
                token: updateDto.token || oldToken,
            },
        });
    }
    async deleteNotificationToken(id) {
        const token = await this.findNotificationTokenById(id);
        await NotificationToken.destroy({
            where: { id },
        });
    }
};
NotificationsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [FirebaseServiceService])
], NotificationsService);
export { NotificationsService };
//# sourceMappingURL=notifications.service.js.map