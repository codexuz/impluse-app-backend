var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCourseDto {
    constructor() {
        this.isActive = true;
    }
}
__decorate([
    ApiProperty({
        description: 'The title of the course',
        minLength: 3,
        example: 'English Grammar Basics'
    }),
    IsString(),
    MinLength(3),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "title", void 0);
__decorate([
    ApiProperty({
        description: 'A detailed description of the course content',
        required: false,
        example: 'Learn the fundamentals of English grammar including parts of speech, sentence structure, and punctuation.'
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "description", void 0);
__decorate([
    ApiProperty({
        description: 'The level of the course',
        required: false,
        example: 'A1'
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "level", void 0);
__decorate([
    ApiProperty({
        description: 'Whether the course is active and visible to students',
        required: false,
        default: true,
        example: true
    }),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateCourseDto.prototype, "isActive", void 0);
__decorate([
    ApiProperty({
        description: 'URL of the course cover image',
        required: false,
        example: 'https://example.com/images/course-cover.jpg'
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "imageUrl", void 0);
//# sourceMappingURL=create-course.dto.js.map