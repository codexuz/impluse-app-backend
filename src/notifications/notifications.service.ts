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
import { Op } from "sequelize";
@Injectable()
export class NotificationsService {
  constructor(private readonly firebaseService: FirebaseServiceService) {}

  async getAllNotifications(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: NotificationResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;

    const { count, rows } = await Notifications.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async createNotificationForAllUsers(
    createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    const notification = await Notifications.create(createNotificationDto);

    // Process users in batches to avoid memory pressure and DB timeouts.
    // Push notifications are dispatched in the background so the request
    // returns immediately regardless of how many users exist.
    const DB_BATCH_SIZE = 500;  // rows per bulkCreate
    const FCM_BATCH_SIZE = 500; // FCM multicast limit per request

    const processBatches = async () => {
      let offset = 0;

      while (true) {
        const users = await User.findAll({
          attributes: ["user_id"],
          limit: DB_BATCH_SIZE,
          offset,
        });

        if (users.length === 0) break;

        // Persist user-notification rows for this batch
        const records = users.map((user) => ({
          user_id: user.user_id,
          notification_id: notification.id,
          seen: false,
        }));

        await UserNotification.bulkCreate(records, { ignoreDuplicates: true });

        // Collect FCM tokens for this batch of users and send in FCM-safe chunks
        try {
          const notificationTokens = await NotificationToken.findAll({
            where: { user_id: users.map((u) => u.user_id) },
          });

          const tokens = notificationTokens.map((nt) => nt.token);

          for (let i = 0; i < tokens.length; i += FCM_BATCH_SIZE) {
            const chunk = tokens.slice(i, i + FCM_BATCH_SIZE);
            await this.notifyMultipleUsers(
              chunk,
              createNotificationDto.title || "New Notification",
              createNotificationDto.body,
              {
                notification_id: notification.id,
                ...(createNotificationDto.data || {}),
                type: "global",
              },
              false,
            );
          }
        } catch (error) {
          console.error(
            `Error sending push notifications for batch at offset ${offset}:`,
            error,
          );
          // Continue to next batch even if push notifications fail
        }

        if (users.length < DB_BATCH_SIZE) break;
        offset += DB_BATCH_SIZE;
      }
    };

    // Fire-and-forget: returns the notification immediately while processing
    // continues in the background, preventing request timeouts on large datasets.
    processBatches().catch((error) =>
      console.error("Error in createNotificationForAllUsers batch processing:", error),
    );

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
        `Notification with ID ${notification_id} not found`,
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
        `User notification not found for user ${user_id} and notification ${notification_id}`,
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
      },
    );
  }

  async getUnseenNotifications(
    user_id: string,
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
    // Get only unseen notifications for this user
    const notifications = await Notifications.findAll({
      include: [
        {
          model: UserNotification,
          as: "user_notifications",
          where: { user_id, seen: false },
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
    createDto: CreateNotificationTokenDto,
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
      return await NotificationToken.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "user_id",
              "username",
              "first_name",
              "last_name",
              "level_id",
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error fetching notification tokens:", error);
      throw error;
    }
  }

  async findNotificationTokensByUserId(
    userId: string,
  ): Promise<NotificationTokenResponseDto[]> {
    return await NotificationToken.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
    });
  }

  async notifyUser(
    deviceToken: string,
    title?: string,
    body?: string,
    data?: Record<string, string>,
  ) {
    const customData = data || { customData: "12345" };
    const notification = await Notifications.create({
      title: title || "Hello!",
      body: body || "This is a test push notification 🚀",
      data: customData,
    } as any);

    const tokenRecord = await NotificationToken.findOne({ where: { token: deviceToken }});
    if (tokenRecord && tokenRecord.user_id) {
       await UserNotification.create({
         user_id: tokenRecord.user_id,
         notification_id: notification.id,
         seen: false
       });
    }

    return this.firebaseService.sendNotification(
      deviceToken,
      title || "Hello!",
      body || "This is a test push notification 🚀",
      customData,
    );
  }

  async notifyMultipleUsers(
    tokens: string[],
    title?: string,
    body?: string,
    data?: Record<string, string>,
    saveToDb: boolean = true,
  ) {
    const customData = data || { customData: "12345" };

    if (saveToDb) {
      const notification = await Notifications.create({
        title: title || "Hello!",
        body: body || "This is a test push notification 🚀",
        data: customData,
      } as any);

      const tokenRecords = await NotificationToken.findAll({ where: { token: tokens }});
      const userIds = [...new Set(tokenRecords.map(t => t.user_id).filter(id => id))];
      
      if (userIds.length > 0) {
        const records = userIds.map(user_id => ({
          user_id,
          notification_id: notification.id,
          seen: false
        }));
        await UserNotification.bulkCreate(records);
      }
    }

    return this.firebaseService.sendMulticastNotification(
      tokens,
      title || "Hello!",
      body || "This is a test push notification 🚀",
      customData,
    );
  }

  async notifyTopic(
    topic: string,
    title?: string,
    body?: string,
    data?: Record<string, string>,
  ) {
    const customData = data || { customData: "12345" };
    
    await Notifications.create({
      title: title || "Hello!",
      body: body || "This is a test push notification 🚀",
      data: { ...customData, topic },
    } as any);

    return this.firebaseService.sendToTopic(
      topic,
      title || "Hello!",
      body || "This is a test push notification 🚀",
      customData,
    );
  }

  /**
   * Send app update notification to all users or specific tokens
   * @param options Optional configuration for the update notification
   * @returns Result of the notification send operation
   */
  async sendAppUpdateNotification(options?: {
    customMessage?: string;
    playStoreUrl?: string;
  }) {
    try {
      // Get all user tokens
      const notificationTokens = await NotificationToken.findAll({
        where: {
          user_id: { [Op.not]: null }, // Only get tokens associated with users
        },
      });
      const tokens = notificationTokens.map((nt) => nt.token);

      if (tokens.length === 0) {
        console.log("No tokens found to send app update notification");
        return;
      }

      return await this.firebaseService.sendAppUpdateNotification(
        tokens,
        options?.customMessage,
        options?.playStoreUrl,
      );
    } catch (error) {
      console.error("Error sending app update notification:", error);
      throw error;
    }
  }

  async findNotificationTokenById(
    id: string,
  ): Promise<NotificationTokenResponseDto> {
    const token = await NotificationToken.findByPk(id);
    if (!token) {
      throw new NotFoundException(`Notification token with ID ${id} not found`);
    }
    return token;
  }

  async updateNotificationToken(
    id: string,
    updateDto: UpdateNotificationTokenDto,
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
    updateDto: UpdateNotificationTokenDto,
  ): Promise<NotificationTokenResponseDto> {
    const token = await NotificationToken.findOne({
      where: {
        user_id: userId,
        token: oldToken,
      },
    });

    if (!token) {
      throw new NotFoundException(
        `Notification token not found for user ${userId} with token ${oldToken}`,
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
