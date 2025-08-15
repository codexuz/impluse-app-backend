import { CreateNotificationDto } from './create-notification.dto.js';
declare const UpdateNotificationDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateNotificationDto>>;
export declare class UpdateNotificationDto extends UpdateNotificationDto_base {
    notification_id?: string;
    user_id?: string;
}
export {};
