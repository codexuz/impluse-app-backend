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
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
export class CreateNotificationDto {
}
__decorate([
    ApiPropertyOptional({
        description: 'Notification title',
        example: 'New Feature Alert'
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "title", void 0);
__decorate([
    ApiProperty({
        description: 'Notification message content',
        example: 'We have added new features to the platform!'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "message", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'URL to an image for the notification',
        example: 'https://example.com/images/notification-image.jpg'
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "img_url", void 0);
//# sourceMappingURL=create-notification.dto.js.map