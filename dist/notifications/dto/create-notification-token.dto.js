var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsUUID, IsOptional } from "class-validator";
export class CreateNotificationTokenDto {
}
__decorate([
    ApiProperty({
        description: "Notification token string",
        example: "fcm_token_1234567890",
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateNotificationTokenDto.prototype, "token", void 0);
__decorate([
    ApiPropertyOptional({
        description: "User ID associated with the notification token",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    IsUUID(4),
    IsOptional(),
    __metadata("design:type", String)
], CreateNotificationTokenDto.prototype, "user_id", void 0);
//# sourceMappingURL=create-notification-token.dto.js.map