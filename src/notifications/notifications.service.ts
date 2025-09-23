import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { CreateNotificationDto } from "./dto/create-notification.dto.js";
import { UpdateNotificationDto } from "./dto/update-notification.dto.js";
import { NotificationResponseDto } from "./dto/notification-response.dto.js";
import { Notifications } from "./entities/notification.entity.js";
import { UserNotification } from "../user-notifications/entities/user-notification.entity.js";
import { User } from "../users/entities/user.entity.js";
import { CreateNotificationTokenDto } from "./dto/create-notification-token.dto.js";
import { UpdateNotificationTokenDto } from "./dto/update-notification-token.dto.js";
import { NotificationTokenResponseDto } from "./dto/notification-token-response.dto.js";
import { NotificationToken } from "./entities/notification-token.entity.js";
import { FirebaseServiceService } from "./firebase-service.service.js";
@Injectable()
export class NotificationsService {
  constructor(private readonly firebaseService: FirebaseServiceService) {}

  async getAllNotifications(): Promise<NotificationResponseDto[]> {
    const notifications = await Notifications.findAll({
      order: [["createdAt", "DESC"]],
    });

    return notifications;
  }

  async createNotificationForAllUsers(
    createNotificationDto: CreateNotificationDto
  ): Promise<NotificationResponseDto> {
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

  async markNotificationSeen(params: {
    notification_id: string;
    user_id: string;
  }): Promise<void> {
    const { notification_id, user_id } = params;

    if (!notification_id || !user_id) {
      throw new BadRequestException("notification_id and user_id are required");
    }

    // Check if the notification exists
    const notification = await Notifications.findByPk(notification_id);
    if (!notification) {
      throw new BadRequestException(
        `Notification with ID ${notification_id} not found`
      );
    }

    // Find the user notification record
    const userNotification = await UserNotification.findOne({
      where: {
        notification_id,
        user_id,
      },
    });

    if (!userNotification) {
      throw new BadRequestException(
        `User notification not found for user ${user_id} and notification ${notification_id}`
      );
    }

    // Update the seen status
    await UserNotification.update(
      { seen: true },
      {
        where: {
          notification_id,
          user_id,
        },
      }
    );
  }

  async getUnseenNotifications(
    user_id: string
  ): Promise<NotificationResponseDto[]> {
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

  async getAllNotificationsWithUnseenCount(user_id: string): Promise<{
    notifications: NotificationResponseDto[];
    unseenCount: number;
  }> {
    // Get all notifications for this user
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

    // Count total unseen notifications
    const unseenCount = await UserNotification.count({
      where: { user_id, seen: false },
    });

    return {
      notifications,
      unseenCount,
    };
  }

  async deleteNotification(notification_id: string): Promise<void> {
    await UserNotification.destroy({
      where: { notification_id },
    });

    await Notifications.destroy({
      where: { id: notification_id },
    });
  }

  async getNotificationById(id: string): Promise<NotificationResponseDto> {
    return await Notifications.findByPk(id);
  }

  // Notification Token Methods
  async createNotificationToken(
    createDto: CreateNotificationTokenDto
  ): Promise<NotificationTokenResponseDto> {
    try {
      // Check if user already has a notification token
      const existingToken = await NotificationToken.findOne({
        where: { user_id: createDto.user_id },
      });

      if (existingToken) {
        // Update existing token with new one
        await existingToken.update({ token: createDto.token });
        return existingToken;
      } else {
        // Create new token if user doesn't have one
        return await NotificationToken.create(createDto);
      }
    } catch (error) {
      console.error("Error creating/updating notification token:", error);
      throw error;
    }
  }

  async findAllNotificationTokens() {
    try {
      return await NotificationToken.findAll();
    } catch (error) {
      console.error("Error fetching notification tokens:", error);
      throw error;
    }
  }

  async findNotificationTokensByUserId(
    userId: string
  ): Promise<NotificationTokenResponseDto[]> {
    return await NotificationToken.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
    });
  }


  async notifyUser(deviceToken: string, title?: string, body?: string, data?: Record<string, string>) {
    return this.firebaseService.sendNotification(
      deviceToken,
      title || 'Hello!',
      body || 'This is a test push notification 🚀',
      data || { customData: '12345' },
    );
  }

  async notifyMultipleUsers(tokens: string[], title?: string, body?: string, data?: Record<string, string>) {
    return this.firebaseService.sendMulticastNotification(
      tokens,
      title || 'Hello!',
      body || 'This is a test push notification 🚀',
      data || { customData: '12345' },
    );
  }

  async notifyTopic(topic: string, title?: string, body?: string, data?: Record<string, string>) {
    return this.firebaseService.sendToTopic(
      topic,
      title || 'Hello!',
      body || 'This is a test push notification 🚀',
      data || { customData: '12345' },
    );
  }
  
  async findNotificationTokenById(
    id: string
  ): Promise<NotificationTokenResponseDto> {
    const token = await NotificationToken.findByPk(id);
    if (!token) {
      throw new NotFoundException(`Notification token with ID ${id} not found`);
    }
    return token;
  }

  async updateNotificationToken(
    id: string,
    updateDto: UpdateNotificationTokenDto
  ): Promise<NotificationTokenResponseDto> {
    const token = await this.findNotificationTokenById(id);

    await NotificationToken.update(updateDto, {
      where: { id },
    });

    return await this.findNotificationTokenById(id);
  }

  async updateNotificationTokenByUserId(
    userId: string,
    oldToken: string,
    updateDto: UpdateNotificationTokenDto
  ): Promise<NotificationTokenResponseDto> {
    const token = await NotificationToken.findOne({
      where: {
        user_id: userId,
        token: oldToken,
      },
    });

    if (!token) {
      throw new NotFoundException(
        `Notification token not found for user ${userId} with token ${oldToken}`
      );
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

  async deleteNotificationToken(id: string): Promise<void> {
    const token = await this.findNotificationTokenById(id);
    await NotificationToken.destroy({
      where: { id },
    });
  }
}
