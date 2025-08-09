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
import { IsBoolean, IsNotEmpty, IsOptional, IsUUID, IsNumber, Min, Max } from 'class-validator';
export class CreateLessonProgressDto {
}
__decorate([
    ApiProperty({ description: 'ID of the student' }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateLessonProgressDto.prototype, "student_id", void 0);
__decorate([
    ApiProperty({ description: 'ID of the lesson' }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateLessonProgressDto.prototype, "lesson_id", void 0);
__decorate([
    ApiProperty({ description: 'Whether the lesson is completed', default: false }),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateLessonProgressDto.prototype, "completed", void 0);
__decorate([
    ApiProperty({ description: 'Progress percentage', default: 0 }),
    IsNumber({ maxDecimalPlaces: 2 }),
    Min(0),
    Max(100),
    IsOptional(),
    __metadata("design:type", Number)
], CreateLessonProgressDto.prototype, "progress_percentage", void 0);
__decorate([
    ApiProperty({ description: 'Whether reading section is completed', default: false }),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateLessonProgressDto.prototype, "reading_completed", void 0);
__decorate([
    ApiProperty({ description: 'Whether listening section is completed', default: false }),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateLessonProgressDto.prototype, "listening_completed", void 0);
__decorate([
    ApiProperty({ description: 'Whether grammar section is completed', default: false }),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateLessonProgressDto.prototype, "grammar_completed", void 0);
__decorate([
    ApiProperty({ description: 'Whether writing section is completed', default: false }),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateLessonProgressDto.prototype, "writing_completed", void 0);
__decorate([
    ApiProperty({ description: 'Whether speaking section is completed', default: false }),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateLessonProgressDto.prototype, "speaking_completed", void 0);
//# sourceMappingURL=create-lesson-progress.dto.js.map