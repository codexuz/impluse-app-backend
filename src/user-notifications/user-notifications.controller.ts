import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UserNotificationsService } from './user-notifications.service.js';
import { CreateUserNotificationDto } from './dto/create-user-notification.dto.js';
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('user-notifications')
export class UserNotificationsController {
  constructor(private readonly userNotificationsService: UserNotificationsService) {}

  @Post()
  create(@Body() createUserNotificationDto: CreateUserNotificationDto) {
    return this.userNotificationsService.create(createUserNotificationDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.userNotificationsService.findAllByUserId(userId);
    }
    return this.userNotificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userNotificationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserNotificationDto: UpdateUserNotificationDto) {
    return this.userNotificationsService.update(id, updateUserNotificationDto);
  }

  @Patch(':id/mark-seen')
  markAsSeen(@Param('id') id: string) {
    return this.userNotificationsService.markAsSeen(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userNotificationsService.remove(id);
  }
}
