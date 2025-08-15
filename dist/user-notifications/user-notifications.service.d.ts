import { CreateUserNotificationDto } from './dto/create-user-notification.dto.js';
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto.js';
import { UserNotification } from './entities/user-notification.entity.js';
export declare class UserNotificationsService {
    private userNotificationModel;
    constructor(userNotificationModel: typeof UserNotification);
    create(createUserNotificationDto: CreateUserNotificationDto): Promise<UserNotification>;
    findAll(): Promise<UserNotification[]>;
    findAllByUserId(userId: string): Promise<UserNotification[]>;
    findOne(id: string): Promise<UserNotification>;
    update(id: string, updateUserNotificationDto: UpdateUserNotificationDto): Promise<UserNotification>;
    remove(id: string): Promise<void>;
    markAsSeen(id: string): Promise<UserNotification>;
}
