import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserNotificationDto } from './dto/create-user-notification.dto.js';
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto.js';
import { UserNotification } from './entities/user-notification.entity.js';

@Injectable()
export class UserNotificationsService {
  constructor(
    @InjectModel(UserNotification)
    private userNotificationModel: typeof UserNotification,
  ) {}

  async create(createUserNotificationDto: CreateUserNotificationDto): Promise<UserNotification> {
    return this.userNotificationModel.create({
      ...createUserNotificationDto,
    });
  }

  async findAll(): Promise<UserNotification[]> {
    return this.userNotificationModel.findAll();
  }

  async findAllByUserId(userId: string): Promise<UserNotification[]> {
    return this.userNotificationModel.findAll({
      where: {
        user_id: userId,
      },
    });
  }

  async findOne(id: string): Promise<UserNotification> {
    const notification = await this.userNotificationModel.findByPk(id);
    if (!notification) {
      throw new NotFoundException(`User notification with ID "${id}" not found`);
    }
    return notification;
  }

  async update(id: string, updateUserNotificationDto: UpdateUserNotificationDto): Promise<UserNotification> {
    const notification = await this.findOne(id);
    await notification.update(updateUserNotificationDto);
    return notification;
  }

  async remove(id: string): Promise<void> {
    const notification = await this.findOne(id);
    await notification.destroy();
  }

  async markAsSeen(id: string): Promise<UserNotification> {
    const notification = await this.findOne(id);
    await notification.update({ seen: true });
    return notification;
  }
}
