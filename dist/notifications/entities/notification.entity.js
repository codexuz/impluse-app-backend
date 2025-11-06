var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, } from "sequelize-typescript";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
let Notifications = class Notifications extends Model {
};
__decorate([
    ApiProperty({
        description: 'Unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Notifications.prototype, "id", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Notification title',
        example: 'New Feature Alert'
    }),
    Column({
        type: DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Notifications.prototype, "title", void 0);
__decorate([
    ApiProperty({
        description: 'Notification message content',
        example: 'We have added new features to the platform!'
    }),
    Column({
        type: DataType.TEXT,
    }),
    __metadata("design:type", String)
], Notifications.prototype, "message", void 0);
__decorate([
    ApiProperty({
        description: 'URL to an image for the notification',
        example: 'https://example.com/images/notification-image.jpg'
    }),
    Column({
        type: DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Notifications.prototype, "img_url", void 0);
__decorate([
    ApiProperty({
        description: 'Date when the notification was created',
        example: '2023-01-01T00:00:00.000Z'
    }),
    CreatedAt,
    __metadata("design:type", Date)
], Notifications.prototype, "createdAt", void 0);
__decorate([
    ApiProperty({
        description: 'Date when the notification was last updated',
        example: '2023-01-01T00:00:00.000Z'
    }),
    UpdatedAt,
    __metadata("design:type", Date)
], Notifications.prototype, "updatedAt", void 0);
Notifications = __decorate([
    Table({
        tableName: "notifications",
        timestamps: true,
    })
], Notifications);
export { Notifications };
//# sourceMappingURL=notification.entity.js.map