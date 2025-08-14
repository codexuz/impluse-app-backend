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
export class GroupChatResponseDto {
}
__decorate([
    ApiProperty({
        description: 'Group chat ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], GroupChatResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({
        description: 'Name of the group chat',
        example: 'Math Study Group',
    }),
    __metadata("design:type", String)
], GroupChatResponseDto.prototype, "name", void 0);
__decorate([
    ApiProperty({
        description: 'Description of the group chat',
        example: 'A group for discussing math homework and study sessions',
        required: false,
    }),
    __metadata("design:type", String)
], GroupChatResponseDto.prototype, "description", void 0);
__decorate([
    ApiProperty({
        description: 'Image URL for the group chat',
        example: 'https://example.com/group-image.jpg',
        required: false,
    }),
    __metadata("design:type", String)
], GroupChatResponseDto.prototype, "image_url", void 0);
__decorate([
    ApiProperty({
        description: 'Link for the group chat',
        example: 'https://example.com/group-link',
        required: false,
    }),
    __metadata("design:type", String)
], GroupChatResponseDto.prototype, "link", void 0);
__decorate([
    ApiProperty({
        description: 'Whether the group chat is private',
        example: false,
    }),
    __metadata("design:type", Boolean)
], GroupChatResponseDto.prototype, "isPrivate", void 0);
__decorate([
    ApiProperty({
        description: 'Creation timestamp',
        example: '2024-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], GroupChatResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty({
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], GroupChatResponseDto.prototype, "updatedAt", void 0);
export class MessageResponseDto {
}
__decorate([
    ApiProperty({
        description: 'Message ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({
        description: 'Group ID where the message belongs',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "chat_group_id", void 0);
__decorate([
    ApiProperty({
        description: 'Sender user ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "sender_id", void 0);
__decorate([
    ApiProperty({
        description: 'Content of the message',
        example: 'Hello everyone! How is the assignment going?',
    }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "content", void 0);
__decorate([
    ApiProperty({
        description: 'Type of the message',
        example: 'text',
        enum: ['text', 'image', 'file', 'video', 'audio'],
    }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "message_type", void 0);
__decorate([
    ApiProperty({
        description: 'Creation timestamp',
        example: '2024-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], MessageResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty({
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], MessageResponseDto.prototype, "updatedAt", void 0);
export class GroupMemberResponseDto {
}
__decorate([
    ApiProperty({
        description: 'Member ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], GroupMemberResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({
        description: 'Group ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], GroupMemberResponseDto.prototype, "chat_group_id", void 0);
__decorate([
    ApiProperty({
        description: 'User ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], GroupMemberResponseDto.prototype, "user_id", void 0);
__decorate([
    ApiProperty({
        description: 'Role of the member in the group',
        example: 'member',
        enum: ['admin', 'member'],
    }),
    __metadata("design:type", String)
], GroupMemberResponseDto.prototype, "role", void 0);
__decorate([
    ApiProperty({
        description: 'Creation timestamp',
        example: '2024-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], GroupMemberResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty({
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], GroupMemberResponseDto.prototype, "updatedAt", void 0);
export class PaginatedResponseDto {
}
__decorate([
    ApiProperty({
        description: 'Array of data items',
        isArray: true,
    }),
    __metadata("design:type", Array)
], PaginatedResponseDto.prototype, "data", void 0);
__decorate([
    ApiProperty({
        description: 'Total number of items',
        example: 50,
    }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "total", void 0);
__decorate([
    ApiProperty({
        description: 'Current page number',
        example: 1,
    }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "page", void 0);
__decorate([
    ApiProperty({
        description: 'Number of items per page',
        example: 10,
    }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "limit", void 0);
__decorate([
    ApiProperty({
        description: 'Total number of pages',
        example: 5,
    }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "totalPages", void 0);
export class SuccessResponseDto {
}
__decorate([
    ApiProperty({
        description: 'Success message',
        example: 'Operation completed successfully',
    }),
    __metadata("design:type", String)
], SuccessResponseDto.prototype, "message", void 0);
//# sourceMappingURL=response.dto.js.map