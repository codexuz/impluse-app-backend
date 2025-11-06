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
import { IsString, IsOptional } from 'class-validator';
export class VoiceChatDto {
}
__decorate([
    ApiProperty({
        description: 'The text input to be processed',
        example: 'Tell me about the weather today',
    }),
    IsString(),
    __metadata("design:type", String)
], VoiceChatDto.prototype, "text", void 0);
__decorate([
    ApiProperty({
        description: 'Optional voice identifier to use for the response',
        example: 'alloy',
        required: false,
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], VoiceChatDto.prototype, "voice", void 0);
//# sourceMappingURL=voice-chat.dto.js.map