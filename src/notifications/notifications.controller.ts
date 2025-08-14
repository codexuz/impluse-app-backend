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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { NotificationsService } from "./notifications.service.js";
import { CreateNotificationDto } from "./dto/create-notification.dto.js";
import { UpdateNotificationDto } from "./dto/update-notification.dto.js";
import { NotificationResponseDto } from "./dto/notification-response.dto.js";
import { MarkNotificationSeenResponseDto } from "./dto/mark-notification-seen-response.dto.js";
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { OnesignalService } from '../onesignal/onesignal.service.js';

@ApiTags('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("notifications")
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly onesignalService: OnesignalService,
  ) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all notifications', 
    type: [NotificationResponseDto] 
  })
  async getAllNotifications() {
    return await this.notificationsService.getAllNotifications();
  }

  @Get(':id')
  @Roles('admin', 'teacher', 'student')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a specific notification', 
    type: NotificationResponseDto 
  })
  async getNotificationById(@Param('id') id: string) {
    return await this.notificationsService.getNotificationById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('admin')
  @ApiOperation({ summary: 'Create notification for all users' })
  @ApiBody({ type: CreateNotificationDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Notification created', 
    type: NotificationResponseDto 
  })
  async createNotificationForAll(@Body() createNotificationDto: CreateNotificationDto) {
    return await this.notificationsService.createNotificationForAllUsers(createNotificationDto);
  }

  @Patch('seen/:notificationId/user/:userId')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher', 'student')
  @ApiOperation({ summary: 'Mark notification as seen' })
  @ApiParam({ name: 'notificationId', description: 'Notification ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Notification marked as seen',
    type: MarkNotificationSeenResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid notification_id or user_id' })
  async markSeen(
    @Param('notificationId') notification_id: string,
    @Param('userId') user_id: string
  ) {
    try {
      await this.notificationsService.markNotificationSeen({ notification_id, user_id });
      return { success: true, message: 'Notification marked as seen' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('unseen/:userId')
  @Roles('admin', 'teacher', 'student')
  @ApiOperation({ summary: 'Get unseen notifications for user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns unseen notifications', 
    type: [NotificationResponseDto] 
  })
  async getUnseen(@Param('userId') userId: string) {
    return await this.notificationsService.getUnseenNotifications(userId);
  }

  @Get('user/:userId')
  @Roles('admin', 'teacher', 'student')
  @ApiOperation({ summary: 'Get all notifications with unseen count for user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ 
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
  })
  async getAllWithUnseenCount(@Param('userId') userId: string) {
    return await this.notificationsService.getAllNotificationsWithUnseenCount(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({ status: 204, description: 'Notification deleted' })
  async delete(@Param('id') id: string) {
    return await this.notificationsService.deleteNotification(id);
  }

  @Post('push')
  @HttpCode(HttpStatus.CREATED)
  @Roles('admin')
  @ApiOperation({ summary: 'Send push notification via OneSignal' })
  @ApiBody({ 
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
  })
  @ApiResponse({ status: 201, description: 'Push notification sent' })
  async sendPushNotification(@Body() notification: any) {
    return await this.onesignalService.sendNotification(notification);
  }
}
