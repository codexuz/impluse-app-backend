import { PartialType } from '@nestjs/mapped-types';
import { CreateUserNotificationDto } from './create-user-notification.dto.js';

export class UpdateUserNotificationDto extends PartialType(CreateUserNotificationDto) {}
