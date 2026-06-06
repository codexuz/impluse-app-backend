import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { GradingsService } from "./gradings.service.js";
import { GradingsController } from "./gradings.controller.js";
import { Grading } from "./entities/grading.entity.js";
import { TelegramBotModule } from '../telegram-bot/telegram-bot.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { User } from '../users/entities/user.entity.js';
import { Group } from '../groups/entities/group.entity.js';
import { GroupStudent } from '../group-students/entities/group-student.entity.js';

@Module({
  imports: [
    SequelizeModule.forFeature([Grading, User, Group, GroupStudent]),
    TelegramBotModule,
    NotificationsModule,
  ],
  controllers: [GradingsController],
  providers: [GradingsService],
  exports: [GradingsService],
})
export class GradingsModule {}
