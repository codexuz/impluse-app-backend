import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service.js";
import { NotificationsController } from "./notifications.controller.js";
import { ConfigModule } from "@nestjs/config";
import { ExpoPushService } from './expo-push.service.js';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, ExpoPushService],
  imports: [ConfigModule],
  exports: [NotificationsService, ExpoPushService],
})
export class NotificationsModule {}
