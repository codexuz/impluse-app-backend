import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service.js";
import { NotificationsController } from "./notifications.controller.js";
import { ConfigModule } from "@nestjs/config";
import { FirebaseServiceService } from './firebase-service.service.js';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, FirebaseServiceService],
  imports: [ConfigModule],
  exports: [NotificationsService, FirebaseServiceService],
})
export class NotificationsModule {}
