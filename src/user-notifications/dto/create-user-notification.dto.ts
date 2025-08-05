import { IsUUID, IsBoolean } from 'class-validator';

export class CreateUserNotificationDto {
    @IsUUID()
    user_id: string;

    @IsUUID()
    notification_id: string;

    @IsBoolean()
    seen: boolean = false;
}
