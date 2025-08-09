var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class NotificationResponseDto {
}
__decorate([
    ApiProperty({
        description: 'Unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "id", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Notification title',
        example: 'New Feature Alert'
    }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "title", void 0);
__decorate([
    ApiProperty({
        description: 'Notification message content',
        example: 'We have added new features to the platform!'
    }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "message", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'URL to an image for the notification',
        example: 'https://example.com/images/notification-image.jpg'
    }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "img_url", void 0);
__decorate([
    ApiProperty({
        description: 'Date when the notification was created',
        example: '2023-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty({
        description: 'Date when the notification was last updated',
        example: '2023-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=notification-response.dto.js.map