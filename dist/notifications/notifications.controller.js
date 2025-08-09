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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, BadRequestException, } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { NotificationsService } from "./notifications.service.js";
import { CreateNotificationDto } from "./dto/create-notification.dto.js";
import { NotificationResponseDto } from "./dto/notification-response.dto.js";
import { MarkNotificationSeenResponseDto } from "./dto/mark-notification-seen-response.dto.js";
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { OnesignalService } from '../onesignal/onesignal.service.js';
let NotificationsController = class NotificationsController {
    constructor(notificationsService, onesignalService) {
        this.notificationsService = notificationsService;
        this.onesignalService = onesignalService;
    }
    async getAllNotifications() {
        return await this.notificationsService.getAllNotifications();
    }
    async getNotificationById(id) {
        return await this.notificationsService.getNotificationById(id);
    }
    async createNotificationForAll(createNotificationDto) {
        return await this.notificationsService.createNotificationForAllUsers(createNotificationDto);
    }
    async markSeen(notification_id, user_id) {
        try {
            await this.notificationsService.markNotificationSeen({ notification_id, user_id });
            return { success: true, message: 'Notification marked as seen' };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getUnseen(userId) {
        return await this.notificationsService.getUnseenNotifications(userId);
    }
    async getAllWithUnseenCount(userId) {
        return await this.notificationsService.getAllNotificationsWithUnseenCount(userId);
    }
    async delete(id) {
        return await this.notificationsService.deleteNotification(id);
    }
    async sendPushNotification(notification) {
        return await this.onesignalService.sendNotification(notification);
    }
};
__decorate([
    Get(),
    Roles('admin'),
    ApiOperation({ summary: 'Get all notifications' }),
    ApiResponse({
        status: 200,
        description: 'Returns all notifications',
        type: [NotificationResponseDto]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getAllNotifications", null);
__decorate([
    Get(':id'),
    Roles('admin', 'teacher', 'student'),
    ApiOperation({ summary: 'Get notification by ID' }),
    ApiParam({ name: 'id', description: 'Notification ID' }),
    ApiResponse({
        status: 200,
        description: 'Returns a specific notification',
        type: NotificationResponseDto
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotificationById", null);
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    Roles('admin'),
    ApiOperation({ summary: 'Create notification for all users' }),
    ApiBody({ type: CreateNotificationDto }),
    ApiResponse({
        status: 201,
        description: 'Notification created',
        type: NotificationResponseDto
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "createNotificationForAll", null);
__decorate([
    Patch('seen/:notificationId/user/:userId'),
    HttpCode(HttpStatus.OK),
    Roles('admin', 'teacher', 'student'),
    ApiOperation({ summary: 'Mark notification as seen' }),
    ApiParam({ name: 'notificationId', description: 'Notification ID' }),
    ApiParam({ name: 'userId', description: 'User ID' }),
    ApiResponse({
        status: 200,
        description: 'Notification marked as seen',
        type: MarkNotificationSeenResponseDto
    }),
    ApiResponse({ status: 400, description: 'Bad Request - Invalid notification_id or user_id' }),
    __param(0, Param('notificationId')),
    __param(1, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markSeen", null);
__decorate([
    Get('unseen/:userId'),
    Roles('admin', 'teacher', 'student'),
    ApiOperation({ summary: 'Get unseen notifications for user' }),
    ApiParam({ name: 'userId', description: 'User ID' }),
    ApiResponse({
        status: 200,
        description: 'Returns unseen notifications',
        type: [NotificationResponseDto]
    }),
    __param(0, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUnseen", null);
__decorate([
    Get('user/:userId'),
    Roles('admin', 'teacher', 'student'),
    ApiOperation({ summary: 'Get all notifications with unseen count for user' }),
    ApiParam({ name: 'userId', description: 'User ID' }),
    ApiResponse({
        status: 200,
        description: 'Returns notifications and unseen count',
        schema: {
            properties: {
                notifications: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/NotificationResponseDto' }
                },
                unseenCount: {
                    type: 'number',
                    example: 5
                }
            }
        }
    }),
    __param(0, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getAllWithUnseenCount", null);
__decorate([
    Delete(':id'),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles('admin'),
    ApiOperation({ summary: 'Delete a notification' }),
    ApiParam({ name: 'id', description: 'Notification ID' }),
    ApiResponse({ status: 204, description: 'Notification deleted' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "delete", null);
__decorate([
    Post('push'),
    HttpCode(HttpStatus.CREATED),
    Roles('admin'),
    ApiOperation({ summary: 'Send push notification via OneSignal' }),
    ApiBody({
        schema: {
            type: 'object',
            properties: {
                contents: {
                    type: 'object',
                    properties: {
                        en: { type: 'string', example: 'Notification message' }
                    }
                },
                headings: {
                    type: 'object',
                    properties: {
                        en: { type: 'string', example: 'Notification title' }
                    }
                },
                included_segments: {
                    type: 'array',
                    items: { type: 'string', example: 'All' }
                }
            }
        }
    }),
    ApiResponse({ status: 201, description: 'Push notification sent' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendPushNotification", null);
NotificationsController = __decorate([
    ApiTags('notifications'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller("notifications"),
    __metadata("design:paramtypes", [NotificationsService,
        OnesignalService])
], NotificationsController);
export { NotificationsController };
//# sourceMappingURL=notifications.controller.js.map