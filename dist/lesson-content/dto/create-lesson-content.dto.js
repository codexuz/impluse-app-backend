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
import { IsString, IsNumber, IsUUID, IsOptional, IsBoolean } from 'class-validator';
export class CreateLessonContentDto {
}
__decorate([
    ApiProperty({ example: 'Introduction to TypeScript' }),
    IsString(),
    __metadata("design:type", String)
], CreateLessonContentDto.prototype, "title", void 0);
__decorate([
    ApiProperty({ example: 'Detailed content about TypeScript...', required: false }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateLessonContentDto.prototype, "content", void 0);
__decorate([
    ApiProperty({ example: 'https://example.com/media/typescript.mp4', required: false }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateLessonContentDto.prototype, "mediaUrl", void 0);
__decorate([
    ApiProperty({ example: 1 }),
    IsNumber(),
    __metadata("design:type", Number)
], CreateLessonContentDto.prototype, "order_number", void 0);
__decorate([
    ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false }),
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], CreateLessonContentDto.prototype, "lessonId", void 0);
__decorate([
    ApiProperty({ example: true, default: true }),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateLessonContentDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-lesson-content.dto.js.map