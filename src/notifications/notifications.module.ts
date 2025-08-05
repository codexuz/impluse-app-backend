import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { NotificationsController } from './notifications.controller.js';
import { OnesignalModule } from '../onesignal/onesignal.module.js';
import { OnesignalService } from '../onesignal/onesignal.service.js';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, OnesignalService],
  imports: [OnesignalModule],
})
export class NotificationsModule {}
