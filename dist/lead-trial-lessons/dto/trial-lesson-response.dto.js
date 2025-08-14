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
export class TrialLessonResponseDto {
}
__decorate([
    ApiProperty({
        description: 'Trial lesson ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    __metadata("design:type", String)
], TrialLessonResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({
        description: 'Scheduled date and time for the trial lesson',
        example: '2024-01-20T14:00:00Z'
    }),
    __metadata("design:type", Date)
], TrialLessonResponseDto.prototype, "scheduledAt", void 0);
__decorate([
    ApiProperty({
        description: 'Trial lesson status',
        example: 'belgilangan'
    }),
    __metadata("design:type", String)
], TrialLessonResponseDto.prototype, "status", void 0);
__decorate([
    ApiProperty({
        description: 'Teacher ID assigned to the trial lesson',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    __metadata("design:type", String)
], TrialLessonResponseDto.prototype, "teacher_id", void 0);
__decorate([
    ApiProperty({
        description: 'Lead ID for the trial lesson',
        example: '123e4567-e89b-12d3-a456-426614174001'
    }),
    __metadata("design:type", String)
], TrialLessonResponseDto.prototype, "lead_id", void 0);
__decorate([
    ApiProperty({
        description: 'Additional notes about the trial lesson',
        example: 'Student is interested in business English'
    }),
    __metadata("design:type", String)
], TrialLessonResponseDto.prototype, "notes", void 0);
__decorate([
    ApiProperty({
        description: 'Creation date',
        example: '2024-01-15T10:30:00Z'
    }),
    __metadata("design:type", Date)
], TrialLessonResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty({
        description: 'Last update date',
        example: '2024-01-15T15:45:00Z'
    }),
    __metadata("design:type", Date)
], TrialLessonResponseDto.prototype, "updatedAt", void 0);
__decorate([
    ApiProperty({
        description: 'Deletion date (for soft delete)',
        example: null,
        required: false
    }),
    __metadata("design:type", Date)
], TrialLessonResponseDto.prototype, "deletedAt", void 0);
export class TrialLessonListResponseDto {
}
__decorate([
    ApiProperty({
        description: 'Array of trial lessons',
        type: [TrialLessonResponseDto]
    }),
    __metadata("design:type", Array)
], TrialLessonListResponseDto.prototype, "trialLessons", void 0);
__decorate([
    ApiProperty({
        description: 'Total number of trial lessons',
        example: 50
    }),
    __metadata("design:type", Number)
], TrialLessonListResponseDto.prototype, "total", void 0);
__decorate([
    ApiProperty({
        description: 'Total number of pages',
        example: 5
    }),
    __metadata("design:type", Number)
], TrialLessonListResponseDto.prototype, "totalPages", void 0);
__decorate([
    ApiProperty({
        description: 'Current page number',
        example: 1
    }),
    __metadata("design:type", Number)
], TrialLessonListResponseDto.prototype, "currentPage", void 0);
export class TrialLessonStatsResponseDto {
}
__decorate([
    ApiProperty({
        description: 'Total number of trial lessons',
        example: 50
    }),
    __metadata("design:type", Number)
], TrialLessonStatsResponseDto.prototype, "totalTrialLessons", void 0);
__decorate([
    ApiProperty({
        description: 'Number of trial lessons by status',
        example: {
            'belgilangan': 20,
            'keldi': 15,
            'kelmadi': 15
        }
    }),
    __metadata("design:type", Object)
], TrialLessonStatsResponseDto.prototype, "trialLessonsByStatus", void 0);
__decorate([
    ApiProperty({
        description: 'Number of trial lessons by teacher',
        example: {
            'teacher1': 25,
            'teacher2': 25
        }
    }),
    __metadata("design:type", Object)
], TrialLessonStatsResponseDto.prototype, "trialLessonsByTeacher", void 0);
__decorate([
    ApiProperty({
        description: 'Upcoming trial lessons count',
        example: 10
    }),
    __metadata("design:type", Number)
], TrialLessonStatsResponseDto.prototype, "upcomingTrialLessons", void 0);
//# sourceMappingURL=trial-lesson-response.dto.js.map