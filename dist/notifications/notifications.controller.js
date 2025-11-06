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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, } from "@nestjs/swagger";
import { NotificationsService } from "./notifications.service.js";
import { CreateNotificationDto } from "./dto/create-notification.dto.js";
import { NotificationResponseDto } from "./dto/notification-response.dto.js";
import { MarkNotificationSeenResponseDto } from "./dto/mark-notification-seen-response.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { CreateNotificationTokenDto } from "./dto/create-notification-token.dto.js";
import { UpdateNotificationTokenDto } from "./dto/update-notification-token.dto.js";
import { NotificationTokenResponseDto } from "./dto/notification-token-response.dto.js";
import { Role } from "../roles/role.enum.js";
import { SendAppUpdateDto } from "./dto/send-app-update.dto.js";
let NotificationsController = class NotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
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
            await this.notificationsService.markNotificationSeen({
                notification_id,
                user_id,
            });
            return { success: true, message: "Notification marked as seen" };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async sendAppUpdate(sendAppUpdateDto) {
        try {
            return await this.notificationsService.sendAppUpdateNotification(sendAppUpdateDto);
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
    async createNotificationToken(createDto) {
        return await this.notificationsService.createNotificationToken(createDto);
    }
    async getAllNotificationTokens() {
        return await this.notificationsService.findAllNotificationTokens();
    }
    async sendPush(token, title, body, data) {
        return this.notificationsService.notifyUser(token, title, body, data);
    }
    async sendMulticastPush(tokens, title, body, data) {
        return this.notificationsService.notifyMultipleUsers(tokens, title, body, data);
    }
    async sendTopicPush(topic, title, body, data) {
        return this.notificationsService.notifyTopic(topic, title, body, data);
    }
    async getNotificationTokensByUserId(userId) {
        return await this.notificationsService.findNotificationTokensByUserId(userId);
    }
    async getNotificationTokenById(id) {
        return await this.notificationsService.findNotificationTokenById(id);
    }
    async updateNotificationToken(id, updateDto) {
        return await this.notificationsService.updateNotificationToken(id, updateDto);
    }
    async updateNotificationTokenByUserId(userId, body) {
        const updateDto = { token: body.newToken };
        return await this.notificationsService.updateNotificationTokenByUserId(userId, body.oldToken, updateDto);
    }
    async deleteNotificationToken(id) {
        return await this.notificationsService.deleteNotificationToken(id);
    }
};
__decorate([
    Get(),
    Roles(Role.ADMIN),
    ApiOperation({ summary: "Get all notifications" }),
    ApiResponse({
        status: 200,
        description: "Returns all notifications",
        type: [NotificationResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getAllNotifications", null);
__decorate([
    Get(":id"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: "Get notification by ID" }),
    ApiParam({ name: "id", description: "Notification ID" }),
    ApiResponse({
        status: 200,
        description: "Returns a specific notification",
        type: NotificationResponseDto,
    }),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotificationById", null);
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    Roles(Role.ADMIN),
    ApiOperation({ summary: "Create notification for all users" }),
    ApiBody({ type: CreateNotificationDto }),
    ApiResponse({
        status: 201,
        description: "Notification created",
        type: NotificationResponseDto,
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "createNotificationForAll", null);
__decorate([
    Patch("seen/:notificationId/user/:userId"),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: "Mark notification as seen" }),
    ApiParam({ name: "notificationId", description: "Notification ID" }),
    ApiParam({ name: "userId", description: "User ID" }),
    ApiResponse({
        status: 200,
        description: "Notification marked as seen",
        type: MarkNotificationSeenResponseDto,
    }),
    ApiResponse({
        status: 400,
        description: "Bad Request - Invalid notification_id or user_id",
    }),
    __param(0, Param("notificationId")),
    __param(1, Param("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markSeen", null);
__decorate([
    Post("app-update"),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN),
    ApiOperation({
        summary: "Send app update notification",
        description: "Send app update notification to all users or specific tokens",
    }),
    ApiBody({ type: SendAppUpdateDto }),
    ApiResponse({
        status: 200,
        description: "App update notification sent successfully",
    }),
    ApiResponse({
        status: 400,
        description: "Bad Request - Invalid input data",
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendAppUpdateDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendAppUpdate", null);
__decorate([
    Get("unseen/:userId"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: "Get unseen notifications for user" }),
    ApiParam({ name: "userId", description: "User ID" }),
    ApiResponse({
        status: 200,
        description: "Returns unseen notifications",
        type: [NotificationResponseDto],
    }),
    __param(0, Param("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUnseen", null);
__decorate([
    Get("user/:userId"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: "Get all notifications with unseen count for user" }),
    ApiParam({ name: "userId", description: "User ID" }),
    ApiResponse({
        status: 200,
        description: "Returns notifications and unseen count",
        schema: {
            properties: {
                notifications: {
                    type: "array",
                    items: { $ref: "#/components/schemas/NotificationResponseDto" },
                },
                unseenCount: {
                    type: "number",
                    example: 5,
                },
            },
        },
    }),
    __param(0, Param("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getAllWithUnseenCount", null);
__decorate([
    Delete(":id"),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles(Role.ADMIN),
    ApiOperation({ summary: "Delete a notification" }),
    ApiParam({ name: "id", description: "Notification ID" }),
    ApiResponse({ status: 204, description: "Notification deleted" }),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "delete", null);
__decorate([
    Post("tokens"),
    HttpCode(HttpStatus.CREATED),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: "Create notification token" }),
    ApiBody({ type: CreateNotificationTokenDto }),
    ApiResponse({
        status: 201,
        description: "Notification token created",
        type: NotificationTokenResponseDto,
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNotificationTokenDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "createNotificationToken", null);
__decorate([
    Get("tokens"),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Get all notification tokens" }),
    ApiResponse({
        status: 200,
        description: "Returns all notification tokens",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getAllNotificationTokens", null);
__decorate([
    Post("push"),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Send push notification to a single device" }),
    ApiBody({
        schema: {
            type: "object",
            properties: {
                token: { type: "string", example: "device_token_here" },
                title: { type: "string", example: "Notification Title" },
                body: { type: "string", example: "Notification message body" },
                data: {
                    type: "object",
                    additionalProperties: { type: "string" },
                    example: { key1: "value1", key2: "value2" },
                },
            },
            required: ["token", "title", "body"],
        },
    }),
    ApiResponse({
        status: 200,
        description: "Push notification sent successfully",
    }),
    __param(0, Body("token")),
    __param(1, Body("title")),
    __param(2, Body("body")),
    __param(3, Body("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendPush", null);
__decorate([
    Post("push/multicast"),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Send push notification to multiple devices" }),
    ApiBody({
        schema: {
            type: "object",
            properties: {
                tokens: {
                    type: "array",
                    items: { type: "string" },
                    example: ["token1", "token2", "token3"],
                },
                title: { type: "string", example: "Notification Title" },
                body: { type: "string", example: "Notification message body" },
                data: {
                    type: "object",
                    additionalProperties: { type: "string" },
                    example: { key1: "value1", key2: "value2" },
                },
            },
            required: ["tokens", "title", "body"],
        },
    }),
    ApiResponse({
        status: 200,
        description: "Multicast push notification sent successfully",
    }),
    __param(0, Body("tokens")),
    __param(1, Body("title")),
    __param(2, Body("body")),
    __param(3, Body("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendMulticastPush", null);
__decorate([
    Post("push/topic"),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Send push notification to a topic" }),
    ApiBody({
        schema: {
            type: "object",
            properties: {
                topic: { type: "string", example: "news" },
                title: { type: "string", example: "Notification Title" },
                body: { type: "string", example: "Notification message body" },
                data: {
                    type: "object",
                    additionalProperties: { type: "string" },
                    example: { key1: "value1", key2: "value2" },
                },
            },
            required: ["topic", "title", "body"],
        },
    }),
    ApiResponse({
        status: 200,
        description: "Topic push notification sent successfully",
    }),
    __param(0, Body("topic")),
    __param(1, Body("title")),
    __param(2, Body("body")),
    __param(3, Body("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendTopicPush", null);
__decorate([
    Get("tokens/user/:userId"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: "Get notification tokens by user ID" }),
    ApiParam({ name: "userId", description: "User ID" }),
    ApiResponse({
        status: 200,
        description: "Returns notification tokens for a user",
        type: [NotificationTokenResponseDto],
    }),
    __param(0, Param("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotificationTokensByUserId", null);
__decorate([
    Get("tokens/:id"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: "Get notification token by ID" }),
    ApiParam({ name: "id", description: "Notification Token ID" }),
    ApiResponse({
        status: 200,
        description: "Returns a specific notification token",
        type: NotificationTokenResponseDto,
    }),
    ApiResponse({ status: 404, description: "Notification token not found" }),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotificationTokenById", null);
__decorate([
    Patch("tokens/:id"),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: "Update notification token" }),
    ApiParam({ name: "id", description: "Notification Token ID" }),
    ApiBody({ type: UpdateNotificationTokenDto }),
    ApiResponse({
        status: 200,
        description: "Notification token updated",
        type: NotificationTokenResponseDto,
    }),
    ApiResponse({ status: 404, description: "Notification token not found" }),
    __param(0, Param("id")),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateNotificationTokenDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "updateNotificationToken", null);
__decorate([
    Patch("tokens/user/:userId"),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({
        summary: "Update notification token by user ID and old token",
    }),
    ApiParam({ name: "userId", description: "User ID" }),
    ApiBody({
        schema: {
            type: "object",
            properties: {
                oldToken: { type: "string", example: "old_device_token" },
                newToken: { type: "string", example: "new_device_token" },
            },
            required: ["oldToken", "newToken"],
        },
    }),
    ApiResponse({
        status: 200,
        description: "Notification token updated",
        type: NotificationTokenResponseDto,
    }),
    ApiResponse({ status: 404, description: "Notification token not found" }),
    __param(0, Param("userId")),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "updateNotificationTokenByUserId", null);
__decorate([
    Delete("tokens/:id"),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: "Delete a notification token" }),
    ApiParam({ name: "id", description: "Notification Token ID" }),
    ApiResponse({ status: 204, description: "Notification token deleted" }),
    ApiResponse({ status: 404, description: "Notification token not found" }),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "deleteNotificationToken", null);
NotificationsController = __decorate([
    ApiTags("notifications"),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller("notifications"),
    __metadata("design:paramtypes", [NotificationsService])
], NotificationsController);
export { NotificationsController };
//# sourceMappingURL=notifications.controller.js.map