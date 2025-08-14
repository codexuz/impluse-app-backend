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
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsUrl } from 'class-validator';
export class CreateStoryDto {
}
__decorate([
    ApiProperty({
        description: 'The title of the story',
        example: 'The Adventure Begins'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateStoryDto.prototype, "title", void 0);
__decorate([
    ApiProperty({
        description: 'The URL to the story content',
        example: 'https://example.com/stories/adventure-begins'
    }),
    IsString(),
    IsUrl(),
    IsOptional(),
    __metadata("design:type", String)
], CreateStoryDto.prototype, "url", void 0);
__decorate([
    ApiProperty({
        description: 'Image URL for the story',
        example: 'https://example.com/images/adventure.jpg',
        required: false
    }),
    IsString(),
    IsUrl(),
    IsOptional(),
    __metadata("design:type", String)
], CreateStoryDto.prototype, "image_url", void 0);
__decorate([
    ApiProperty({
        description: 'Whether the story is published or not',
        example: true,
        default: false
    }),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateStoryDto.prototype, "isPublished", void 0);
//# sourceMappingURL=create-story.dto.js.map