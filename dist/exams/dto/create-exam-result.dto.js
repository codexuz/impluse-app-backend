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
import { IsNotEmpty, IsUUID, IsNumber, IsOptional, IsEnum, IsString, IsBoolean, IsObject, Min, Max, } from 'class-validator';
export class CreateExamResultDto {
}
__decorate([
    ApiProperty({
        description: 'UUID of the exam',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateExamResultDto.prototype, "exam_id", void 0);
__decorate([
    ApiProperty({
        description: 'UUID of the student',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateExamResultDto.prototype, "student_id", void 0);
__decorate([
    ApiProperty({
        description: 'Score received in the exam',
        example: 85,
    }),
    IsNumber(),
    Min(0),
    IsNotEmpty(),
    __metadata("design:type", Number)
], CreateExamResultDto.prototype, "score", void 0);
__decorate([
    ApiProperty({
        description: 'Maximum possible score',
        example: 100,
        default: 100,
    }),
    IsNumber(),
    Min(1),
    IsOptional(),
    __metadata("design:type", Number)
], CreateExamResultDto.prototype, "max_score", void 0);
__decorate([
    ApiProperty({
        description: 'Score as a percentage',
        example: 85.5,
    }),
    IsNumber(),
    Min(0),
    Max(100),
    IsOptional(),
    __metadata("design:type", Number)
], CreateExamResultDto.prototype, "percentage", void 0);
__decorate([
    ApiProperty({
        description: 'Final result of the exam',
        enum: ['passed', 'failed'],
        example: 'passed',
    }),
    IsEnum(['passed', 'failed']),
    IsOptional(),
    __metadata("design:type", String)
], CreateExamResultDto.prototype, "result", void 0);
__decorate([
    ApiProperty({
        description: 'Individual scores for each section',
        example: {
            reading: 90,
            writing: 85,
            listening: 80,
            speaking: 75,
            grammar: 85,
            vocabulary: 90,
        },
    }),
    IsObject(),
    IsOptional(),
    __metadata("design:type", Object)
], CreateExamResultDto.prototype, "section_scores", void 0);
__decorate([
    ApiProperty({
        description: 'Teacher feedback on the exam',
        example: 'Good performance overall. Needs to improve listening skills.',
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateExamResultDto.prototype, "feedback", void 0);
__decorate([
    ApiProperty({
        description: 'Whether the exam is completed by the student',
        example: true,
        default: true,
    }),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateExamResultDto.prototype, "is_completed", void 0);
//# sourceMappingURL=create-exam-result.dto.js.map