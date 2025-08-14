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
import { IsString, IsOptional, IsBoolean, IsNotEmpty, MaxLength } from 'class-validator';
export class CreateGroupChatDto {
    constructor() {
        this.isPrivate = false;
    }
}
__decorate([
    ApiProperty({
        description: 'Name of the group chat',
        example: 'Math Study Group',
        maxLength: 255,
    }),
    IsString(),
    IsNotEmpty(),
    MaxLength(255),
    __metadata("design:type", String)
], CreateGroupChatDto.prototype, "name", void 0);
__decorate([
    ApiProperty({
        description: 'Description of the group chat',
        example: 'A group for discussing math homework and study sessions',
        required: false,
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateGroupChatDto.prototype, "description", void 0);
__decorate([
    ApiProperty({
        description: 'Image URL for the group chat',
        example: 'https://example.com/group-image.jpg',
        required: false,
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateGroupChatDto.prototype, "image_url", void 0);
__decorate([
    ApiProperty({
        description: 'Link for the group chat',
        example: 'https://example.com/group-link',
        required: false,
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateGroupChatDto.prototype, "link", void 0);
__decorate([
    ApiProperty({
        description: 'Whether the group chat is private',
        example: false,
        default: false,
    }),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateGroupChatDto.prototype, "isPrivate", void 0);
//# sourceMappingURL=create-group-chat.dto.js.map