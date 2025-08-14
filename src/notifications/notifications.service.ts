import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto.js';
import { UpdateNotificationDto } from './dto/update-notification.dto.js';
import { NotificationResponseDto } from './dto/notification-response.dto.js';
import { Notifications } from './entities/notification.entity.js';
import { UserNotification } from '../user-notifications/entities/user-notification.entity.js';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class NotificationsService {

  async getAllNotifications(): Promise<NotificationResponseDto[]> {
    const notifications = await Notifications.findAll({
      order: [['createdAt', 'DESC']],
    });
    
    return notifications;
  }

  async createNotificationForAllUsers(createNotificationDto: CreateNotificationDto): Promise<NotificationResponseDto> {
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


async markNotificationSeen(params: { notification_id: string; user_id: string }): Promise<void> {
  const { notification_id, user_id } = params;
  
  if (!notification_id || !user_id) {
    throw new BadRequestException('notification_id and user_id are required');
  }

  // Check if the notification exists
  const notification = await Notifications.findByPk(notification_id);
  if (!notification) {
    throw new BadRequestException(`Notification with ID ${notification_id} not found`);
  }
  
  // Find the user notification record
  const userNotification = await UserNotification.findOne({
    where: {
      notification_id,
      user_id
    }
  });

  if (!userNotification) {
    throw new BadRequestException(`User notification not found for user ${user_id} and notification ${notification_id}`);
  }
  
  // Update the seen status
  await UserNotification.update(
    { seen: true },
    { where: { 
      notification_id,
      user_id
    }}
  );
}


async getUnseenNotifications(user_id: string): Promise<NotificationResponseDto[]> {
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

async getAllNotificationsWithUnseenCount(user_id: string): Promise<{
  notifications: NotificationResponseDto[],
  unseenCount: number
}> {
  // Get all notifications for this user
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

  // Count total unseen notifications
  const unseenCount = await UserNotification.count({
    where: { user_id, seen: false }
  });

  return {
    notifications,
    unseenCount
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


}
