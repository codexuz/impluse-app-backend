var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, BadRequestException } from '@nestjs/common';
import { Notifications } from './entities/notification.entity.js';
import { UserNotification } from '../user-notifications/entities/user-notification.entity.js';
import { User } from '../users/entities/user.entity.js';
let NotificationsService = class NotificationsService {
    async getAllNotifications() {
        const notifications = await Notifications.findAll({
            order: [['createdAt', 'DESC']],
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
        return notification;
    }
    async markNotificationSeen(params) {
        const { notification_id, user_id } = params;
        if (!notification_id || !user_id) {
            throw new BadRequestException('notification_id and user_id are required');
        }
        const notification = await Notifications.findByPk(notification_id);
        if (!notification) {
            throw new BadRequestException(`Notification with ID ${notification_id} not found`);
        }
        const userNotification = await UserNotification.findOne({
            where: {
                notification_id,
                user_id
            }
        });
        if (!userNotification) {
            throw new BadRequestException(`User notification not found for user ${user_id} and notification ${notification_id}`);
        }
        await UserNotification.update({ seen: true }, { where: {
                notification_id,
                user_id
            } });
    }
    async getUnseenNotifications(user_id) {
        return await Notifications.findAll({
            include: [
                {
                    model: UserNotification,
                    as: 'user_notifications',
                    where: { user_id, seen: false },
                    attributes: [],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
    }
    async getAllNotificationsWithUnseenCount(user_id) {
        const notifications = await Notifications.findAll({
            include: [
                {
                    model: UserNotification,
                    as: 'user_notifications',
                    where: { user_id },
                },
            ],
            order: [['createdAt', 'DESC']],
        });
        const unseenCount = await UserNotification.count({
            where: { user_id, seen: false }
        });
        return {
            notifications,
            unseenCount
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
};
NotificationsService = __decorate([
    Injectable()
], NotificationsService);
export { NotificationsService };
//# sourceMappingURL=notifications.service.js.map