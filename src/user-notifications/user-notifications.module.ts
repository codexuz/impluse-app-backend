import { Module } from '@nestjs/common';
import { UserNotificationsService } from './user-notifications.service.js';
import { UserNotificationsController } from './user-notifications.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserNotification } from './entities/user-notification.entity.js';
@Module({
  imports: [
    SequelizeModule.forFeature([UserNotification]),
  ],  
  controllers: [UserNotificationsController],
  providers: [UserNotificationsService],
  exports: [UserNotificationsService, SequelizeModule],
})
export class UserNotificationsModule {}
