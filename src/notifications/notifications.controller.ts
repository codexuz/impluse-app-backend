import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  HttpException,
  BadRequestException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { NotificationsService } from "./notifications.service.js";
import { CreateNotificationDto } from "./dto/create-notification.dto.js";
import { UpdateNotificationDto } from "./dto/update-notification.dto.js";
import { NotificationResponseDto } from "./dto/notification-response.dto.js";
import { MarkNotificationSeenResponseDto } from "./dto/mark-notification-seen-response.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { CreateNotificationTokenDto } from "./dto/create-notification-token.dto.js";
import { UpdateNotificationTokenDto } from "./dto/update-notification-token.dto.js";
import { NotificationTokenResponseDto } from "./dto/notification-token-response.dto.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("notifications")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("notifications")
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all notifications" })
  @ApiResponse({
    status: 200,
    description: "Returns all notifications",
    type: [NotificationResponseDto],
  })
  async getAllNotifications() {
    return await this.notificationsService.getAllNotifications();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get notification by ID" })
  @ApiParam({ name: "id", description: "Notification ID" })
  @ApiResponse({
    status: 200,
    description: "Returns a specific notification",
    type: NotificationResponseDto,
  })
  async getNotificationById(@Param("id") id: string) {
    return await this.notificationsService.getNotificationById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create notification for all users" })
  @ApiBody({ type: CreateNotificationDto })
  @ApiResponse({
    status: 201,
    description: "Notification created",
    type: NotificationResponseDto,
  })
  async createNotificationForAll(
    @Body() createNotificationDto: CreateNotificationDto
  ) {
    return await this.notificationsService.createNotificationForAllUsers(
      createNotificationDto
    );
  }

  @Patch("seen/:notificationId/user/:userId")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Mark notification as seen" })
  @ApiParam({ name: "notificationId", description: "Notification ID" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "Notification marked as seen",
    type: MarkNotificationSeenResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid notification_id or user_id",
  })
  async markSeen(
    @Param("notificationId") notification_id: string,
    @Param("userId") user_id: string
  ) {
    try {
      await this.notificationsService.markNotificationSeen({
        notification_id,
        user_id,
      });
      return { success: true, message: "Notification marked as seen" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get("unseen/:userId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get unseen notifications for user" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "Returns unseen notifications",
    type: [NotificationResponseDto],
  })
  async getUnseen(@Param("userId") userId: string) {
    return await this.notificationsService.getUnseenNotifications(userId);
  }

  @Get("user/:userId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all notifications with unseen count for user" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiResponse({
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
  })
  async getAllWithUnseenCount(@Param("userId") userId: string) {
    return await this.notificationsService.getAllNotificationsWithUnseenCount(
      userId
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete a notification" })
  @ApiParam({ name: "id", description: "Notification ID" })
  @ApiResponse({ status: 204, description: "Notification deleted" })
  async delete(@Param("id") id: string) {
    return await this.notificationsService.deleteNotification(id);
  }

  // Notification Token Endpoints
  @Post("tokens")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Create notification token" })
  @ApiBody({ type: CreateNotificationTokenDto })
  @ApiResponse({
    status: 201,
    description: "Notification token created",
    type: NotificationTokenResponseDto,
  })
  async createNotificationToken(@Body() createDto: CreateNotificationTokenDto) {
    return await this.notificationsService.createNotificationToken(createDto);
  }

  @Get("tokens")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all notification tokens" })
  @ApiResponse({
    status: 200,
    description: "Returns all notification tokens",
  })
  async getAllNotificationTokens() {
    return await this.notificationsService.findAllNotificationTokens();
  }

  @Post("push")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Send push notification to a single device" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        token: { type: "string", example: "device_token_here" },
        title: { type: "string", example: "Notification Title" },
        body: { type: "string", example: "Notification message body" },
        data: { 
          type: "object", 
          additionalProperties: { type: "string" },
          example: { "key1": "value1", "key2": "value2" }
        }
      },
      required: ["token", "title", "body"]
    }
  })
  @ApiResponse({
    status: 200,
    description: "Push notification sent successfully"
  })
  async sendPush(
    @Body('token') token: string,
    @Body('title') title: string,
    @Body('body') body: string,
    @Body('data') data?: Record<string, string>,
  ) {
    return this.notificationsService.notifyUser(token, title, body, data);
  }

  @Post("push/multicast")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Send push notification to multiple devices" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        tokens: { 
          type: "array", 
          items: { type: "string" },
          example: ["token1", "token2", "token3"]
        },
        title: { type: "string", example: "Notification Title" },
        body: { type: "string", example: "Notification message body" },
        data: { 
          type: "object", 
          additionalProperties: { type: "string" },
          example: { "key1": "value1", "key2": "value2" }
        }
      },
      required: ["tokens", "title", "body"]
    }
  })
  @ApiResponse({
    status: 200,
    description: "Multicast push notification sent successfully"
  })
  async sendMulticastPush(
    @Body('tokens') tokens: string[],
    @Body('title') title: string,
    @Body('body') body: string,
    @Body('data') data?: Record<string, string>,
  ) {
    return this.notificationsService.notifyMultipleUsers(tokens, title, body, data);
  }

  @Post("push/topic")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Send push notification to a topic" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        topic: { type: "string", example: "news" },
        title: { type: "string", example: "Notification Title" },
        body: { type: "string", example: "Notification message body" },
        data: { 
          type: "object", 
          additionalProperties: { type: "string" },
          example: { "key1": "value1", "key2": "value2" }
        }
      },
      required: ["topic", "title", "body"]
    }
  })
  @ApiResponse({
    status: 200,
    description: "Topic push notification sent successfully"
  })
  async sendTopicPush(
    @Body('topic') topic: string,
    @Body('title') title: string,
    @Body('body') body: string,
    @Body('data') data?: Record<string, string>,
  ) {
    return this.notificationsService.notifyTopic(topic, title, body, data);
  }

  @Get("tokens/user/:userId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get notification tokens by user ID" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "Returns notification tokens for a user",
    type: [NotificationTokenResponseDto],
  })
  async getNotificationTokensByUserId(@Param("userId") userId: string) {
    return await this.notificationsService.findNotificationTokensByUserId(
      userId
    );
  }

  @Get("tokens/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get notification token by ID" })
  @ApiParam({ name: "id", description: "Notification Token ID" })
  @ApiResponse({
    status: 200,
    description: "Returns a specific notification token",
    type: NotificationTokenResponseDto,
  })
  @ApiResponse({ status: 404, description: "Notification token not found" })
  async getNotificationTokenById(@Param("id") id: string) {
    return await this.notificationsService.findNotificationTokenById(id);
  }

  @Patch("tokens/:id")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Update notification token" })
  @ApiParam({ name: "id", description: "Notification Token ID" })
  @ApiBody({ type: UpdateNotificationTokenDto })
  @ApiResponse({
    status: 200,
    description: "Notification token updated",
    type: NotificationTokenResponseDto,
  })
  @ApiResponse({ status: 404, description: "Notification token not found" })
  async updateNotificationToken(
    @Param("id") id: string,
    @Body() updateDto: UpdateNotificationTokenDto
  ) {
    return await this.notificationsService.updateNotificationToken(
      id,
      updateDto
    );
  }

  @Patch("tokens/user/:userId")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: "Update notification token by user ID and old token",
  })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        oldToken: { type: "string", example: "old_device_token" },
        newToken: { type: "string", example: "new_device_token" },
      },
      required: ["oldToken", "newToken"],
    },
  })
  @ApiResponse({
    status: 200,
    description: "Notification token updated",
    type: NotificationTokenResponseDto,
  })
  @ApiResponse({ status: 404, description: "Notification token not found" })
  async updateNotificationTokenByUserId(
    @Param("userId") userId: string,
    @Body() body: { oldToken: string; newToken: string }
  ) {
    const updateDto: UpdateNotificationTokenDto = { token: body.newToken };
    return await this.notificationsService.updateNotificationTokenByUserId(
      userId,
      body.oldToken,
      updateDto
    );
  }

  @Delete("tokens/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Delete a notification token" })
  @ApiParam({ name: "id", description: "Notification Token ID" })
  @ApiResponse({ status: 204, description: "Notification token deleted" })
  @ApiResponse({ status: 404, description: "Notification token not found" })
  async deleteNotificationToken(@Param("id") id: string) {
    return await this.notificationsService.deleteNotificationToken(id);
  }


}
