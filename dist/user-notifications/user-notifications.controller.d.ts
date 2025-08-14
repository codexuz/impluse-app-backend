import { UserNotificationsService } from './user-notifications.service.js';
import { CreateUserNotificationDto } from './dto/create-user-notification.dto.js';
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto.js';
export declare class UserNotificationsController {
    private readonly userNotificationsService;
    constructor(userNotificationsService: UserNotificationsService);
    create(createUserNotificationDto: CreateUserNotificationDto): Promise<import("./entities/user-notification.entity.js").UserNotification>;
    findAll(userId?: string): Promise<import("./entities/user-notification.entity.js").UserNotification[]>;
    findOne(id: string): Promise<import("./entities/user-notification.entity.js").UserNotification>;
    update(id: string, updateUserNotificationDto: UpdateUserNotificationDto): Promise<import("./entities/user-notification.entity.js").UserNotification>;
    markAsSeen(id: string): Promise<import("./entities/user-notification.entity.js").UserNotification>;
    remove(id: string): Promise<void>;
}
