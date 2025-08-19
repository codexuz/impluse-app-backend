var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserNotification } from './entities/user-notification.entity.js';
let UserNotificationsService = class UserNotificationsService {
    constructor(userNotificationModel) {
        this.userNotificationModel = userNotificationModel;
    }
    async create(createUserNotificationDto) {
        return this.userNotificationModel.create({
            ...createUserNotificationDto,
        });
    }
    async findAll() {
        return this.userNotificationModel.findAll();
    }
    async findAllByUserId(userId) {
        return this.userNotificationModel.findAll({
            where: {
                user_id: userId,
            },
        });
    }
    async findOne(id) {
        const notification = await this.userNotificationModel.findByPk(id);
        if (!notification) {
            throw new NotFoundException(`User notification with ID "${id}" not found`);
        }
        return notification;
    }
    async update(id, updateUserNotificationDto) {
        const notification = await this.findOne(id);
        await notification.update(updateUserNotificationDto);
        return notification;
    }
    async remove(id) {
        const notification = await this.findOne(id);
        await notification.destroy();
    }
    async markAsSeen(id) {
        const notification = await this.findOne(id);
        await notification.update({ seen: true });
        return notification;
    }
};
UserNotificationsService = __decorate([
    Injectable(),
    __param(0, InjectModel(UserNotification)),
    __metadata("design:paramtypes", [Object])
], UserNotificationsService);
export { UserNotificationsService };
//# sourceMappingURL=user-notifications.service.js.map