import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { GradingsService } from "./gradings.service.js";
import { GradingsController } from "./gradings.controller.js";
import { Grading } from "./entities/grading.entity.js";
import { TelegramBotModule } from '../telegram-bot/telegram-bot.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { User } from '../users/entities/user.entity.js';
import { UserRole } from '../users/entities/user-role.model.js';
import { Role } from '../users/entities/role.model.js';

@Module({
  imports: [
    SequelizeModule.forFeature([Grading, User, UserRole, Role]),
    TelegramBotModule,
    NotificationsModule,
  ],
  controllers: [GradingsController],
  providers: [GradingsService],
  exports: [GradingsService],
})
export class GradingsModule {}
