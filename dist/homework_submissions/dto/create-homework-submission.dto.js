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
import { IsNotEmpty, IsUUID, IsOptional, IsNumber, IsEnum, IsString, IsUrl, Min, Max } from 'class-validator';
export class CreateHomeworkSubmissionDto {
}
__decorate([
    ApiProperty({
        description: 'UUID of the homework',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateHomeworkSubmissionDto.prototype, "homework_id", void 0);
__decorate([
    ApiProperty({
        description: 'UUID of the student',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateHomeworkSubmissionDto.prototype, "student_id", void 0);
__decorate([
    ApiProperty({
        description: 'Completion percentage of homework',
        example: 85.5,
        required: false,
        minimum: 0,
        maximum: 100
    }),
    IsNumber(),
    Min(0),
    Max(100),
    IsOptional(),
    __metadata("design:type", Number)
], CreateHomeworkSubmissionDto.prototype, "percentage", void 0);
__decorate([
    ApiProperty({
        description: 'Status of homework submission',
        enum: ['passed', 'failed', 'incomplete'],
        example: 'passed',
        required: false
    }),
    IsEnum(['passed', 'failed', 'incomplete']),
    IsOptional(),
    __metadata("design:type", String)
], CreateHomeworkSubmissionDto.prototype, "status", void 0);
__decorate([
    ApiProperty({
        description: 'Section of the homework',
        enum: ['reading', 'listening', 'grammar', 'writing', 'speaking'],
        example: 'writing'
    }),
    IsEnum(['reading', 'listening', 'grammar', 'writing', 'speaking']),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateHomeworkSubmissionDto.prototype, "section", void 0);
__decorate([
    ApiProperty({
        description: 'URL of the submitted file',
        example: 'https://storage.example.com/submissions/homework1.pdf',
        required: false
    }),
    IsUrl(),
    IsOptional(),
    __metadata("design:type", String)
], CreateHomeworkSubmissionDto.prototype, "file_url", void 0);
__decorate([
    ApiProperty({
        description: 'Teacher feedback on the submission',
        example: 'Good work, but needs improvement in section 2.',
        required: false
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateHomeworkSubmissionDto.prototype, "feedback", void 0);
//# sourceMappingURL=create-homework-submission.dto.js.map