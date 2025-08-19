var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateChatDto {
}
__decorate([
    ApiProperty({
        description: 'The role of the message sender',
        enum: ['user', 'assistant'],
        example: 'user'
    }),
    IsEnum(['user', 'assistant']),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateChatDto.prototype, "role", void 0);
__decorate([
    ApiProperty({
        description: 'The content of the chat message',
        example: 'Hello, how can you help me with my English studies?'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateChatDto.prototype, "content", void 0);
//# sourceMappingURL=create-chat.dto.js.map