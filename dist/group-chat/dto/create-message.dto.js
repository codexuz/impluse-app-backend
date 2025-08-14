var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
export var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "text";
    MessageType["IMAGE"] = "image";
    MessageType["FILE"] = "file";
    MessageType["VIDEO"] = "video";
    MessageType["AUDIO"] = "audio";
})(MessageType || (MessageType = {}));
export class CreateMessageDto {
    constructor() {
        this.message_type = MessageType.TEXT;
    }
}
__decorate([
    ApiProperty({
        description: 'Group ID where the message belongs',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "group_id", void 0);
__decorate([
    ApiProperty({
        description: 'Content of the message',
        example: 'Hello everyone! How is the assignment going?',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "content", void 0);
__decorate([
    ApiProperty({
        description: 'Type of the message',
        enum: MessageType,
        example: MessageType.TEXT,
        default: MessageType.TEXT,
    }),
    IsEnum(MessageType),
    IsOptional(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "message_type", void 0);
//# sourceMappingURL=create-message.dto.js.map