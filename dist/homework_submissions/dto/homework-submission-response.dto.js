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
export class HomeworkSectionResponseDto {
}
__decorate([
    ApiProperty({
        description: 'UUID of the section',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    __metadata("design:type", String)
], HomeworkSectionResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({
        description: 'UUID of the submission',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    __metadata("design:type", String)
], HomeworkSectionResponseDto.prototype, "submission_id", void 0);
__decorate([
    ApiProperty({
        description: 'UUID of the lesson',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false
    }),
    __metadata("design:type", String)
], HomeworkSectionResponseDto.prototype, "lesson_id", void 0);
__decorate([
    ApiProperty({
        description: 'UUID of the exercise',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false
    }),
    __metadata("design:type", String)
], HomeworkSectionResponseDto.prototype, "exercise_id", void 0);
__decorate([
    ApiProperty({
        description: 'Score achieved in this section (0-100)',
        example: 85.5,
        required: false
    }),
    __metadata("design:type", Number)
], HomeworkSectionResponseDto.prototype, "percentage", void 0);
__decorate([
    ApiProperty({
        description: 'Status of this section',
        enum: ['passed', 'failed', 'incomplete'],
        example: 'passed',
        required: false
    }),
    __metadata("design:type", String)
], HomeworkSectionResponseDto.prototype, "status", void 0);
__decorate([
    ApiProperty({
        description: 'Section type',
        enum: ['reading', 'listening', 'grammar', 'writing', 'speaking'],
        example: 'writing'
    }),
    __metadata("design:type", String)
], HomeworkSectionResponseDto.prototype, "section", void 0);
__decorate([
    ApiProperty({
        description: 'Student answers for this section',
        example: { 'question1': 'answer1', 'question2': 'answer2' },
        required: false
    }),
    __metadata("design:type", Object)
], HomeworkSectionResponseDto.prototype, "answers", void 0);
__decorate([
    ApiProperty({
        description: 'URL of the submitted file for this section',
        example: 'https://storage.example.com/submissions/homework1.pdf',
        required: false
    }),
    __metadata("design:type", String)
], HomeworkSectionResponseDto.prototype, "file_url", void 0);
__decorate([
    ApiProperty({
        description: 'Teacher feedback on this section',
        example: 'Good work, but needs improvement in section 2.',
        required: false
    }),
    __metadata("design:type", String)
], HomeworkSectionResponseDto.prototype, "feedback", void 0);
__decorate([
    ApiProperty({
        description: 'Creation timestamp',
        example: '2023-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], HomeworkSectionResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty({
        description: 'Last update timestamp',
        example: '2023-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], HomeworkSectionResponseDto.prototype, "updatedAt", void 0);
export class HomeworkSubmissionResponseDto {
}
__decorate([
    ApiProperty({
        description: 'UUID of the submission',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    __metadata("design:type", String)
], HomeworkSubmissionResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({
        description: 'UUID of the homework',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    __metadata("design:type", String)
], HomeworkSubmissionResponseDto.prototype, "homework_id", void 0);
__decorate([
    ApiProperty({
        description: 'UUID of the student',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    __metadata("design:type", String)
], HomeworkSubmissionResponseDto.prototype, "student_id", void 0);
__decorate([
    ApiProperty({
        description: 'Overall completion percentage',
        example: 85.5,
        required: false
    }),
    __metadata("design:type", Number)
], HomeworkSubmissionResponseDto.prototype, "completion_percentage", void 0);
__decorate([
    ApiProperty({
        description: 'Overall submission status',
        enum: ['submitted', 'graded', 'not_submitted'],
        example: 'graded',
        required: false
    }),
    __metadata("design:type", String)
], HomeworkSubmissionResponseDto.prototype, "overall_status", void 0);
__decorate([
    ApiProperty({
        description: 'Creation timestamp',
        example: '2023-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], HomeworkSubmissionResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty({
        description: 'Last update timestamp',
        example: '2023-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], HomeworkSubmissionResponseDto.prototype, "updatedAt", void 0);
__decorate([
    ApiProperty({
        description: 'Homework sections associated with this submission',
        type: [HomeworkSectionResponseDto],
        required: false
    }),
    __metadata("design:type", Array)
], HomeworkSubmissionResponseDto.prototype, "sections", void 0);
export class HomeworkSubmissionWithSectionResponseDto {
}
__decorate([
    ApiProperty({
        description: 'The main homework submission',
        type: HomeworkSubmissionResponseDto
    }),
    __metadata("design:type", HomeworkSubmissionResponseDto)
], HomeworkSubmissionWithSectionResponseDto.prototype, "submission", void 0);
__decorate([
    ApiProperty({
        description: 'The homework section',
        type: HomeworkSectionResponseDto
    }),
    __metadata("design:type", HomeworkSectionResponseDto)
], HomeworkSubmissionWithSectionResponseDto.prototype, "section", void 0);
//# sourceMappingURL=homework-submission-response.dto.js.map