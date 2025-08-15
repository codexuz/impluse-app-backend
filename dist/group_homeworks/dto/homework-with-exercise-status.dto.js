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
export class ExerciseWithStatusDto {
}
__decorate([
    ApiProperty({ description: 'Exercise ID' }),
    __metadata("design:type", String)
], ExerciseWithStatusDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ description: 'Exercise type' }),
    __metadata("design:type", String)
], ExerciseWithStatusDto.prototype, "exercise_type", void 0);
__decorate([
    ApiProperty({ description: 'Lesson ID' }),
    __metadata("design:type", String)
], ExerciseWithStatusDto.prototype, "lesson_id", void 0);
__decorate([
    ApiProperty({ description: 'Exercise completion status', enum: ['finished', 'unfinished'] }),
    __metadata("design:type", String)
], ExerciseWithStatusDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ description: 'Associated submission data', required: false }),
    __metadata("design:type", Object)
], ExerciseWithStatusDto.prototype, "submission", void 0);
export class SpeakingWithStatusDto {
}
__decorate([
    ApiProperty({ description: 'Speaking exercise ID' }),
    __metadata("design:type", String)
], SpeakingWithStatusDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ description: 'Lesson ID' }),
    __metadata("design:type", String)
], SpeakingWithStatusDto.prototype, "lesson_id", void 0);
__decorate([
    ApiProperty({ description: 'Speaking exercise completion status', enum: ['finished', 'unfinished'] }),
    __metadata("design:type", String)
], SpeakingWithStatusDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ description: 'Associated submission data', required: false }),
    __metadata("design:type", Object)
], SpeakingWithStatusDto.prototype, "submission", void 0);
export class VocabularyWithStatusDto {
}
__decorate([
    ApiProperty({ description: 'Vocabulary set ID' }),
    __metadata("design:type", String)
], VocabularyWithStatusDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ description: 'Lesson ID' }),
    __metadata("design:type", String)
], VocabularyWithStatusDto.prototype, "lesson_id", void 0);
__decorate([
    ApiProperty({ description: 'Vocabulary completion status', enum: ['finished', 'unfinished'] }),
    __metadata("design:type", String)
], VocabularyWithStatusDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ description: 'Associated submission data', required: false }),
    __metadata("design:type", Object)
], VocabularyWithStatusDto.prototype, "submission", void 0);
export class LessonWithExerciseStatusDto {
}
__decorate([
    ApiProperty({ description: 'Lesson ID' }),
    __metadata("design:type", String)
], LessonWithExerciseStatusDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ description: 'Lesson title' }),
    __metadata("design:type", String)
], LessonWithExerciseStatusDto.prototype, "title", void 0);
__decorate([
    ApiProperty({ description: 'Lesson number' }),
    __metadata("design:type", Number)
], LessonWithExerciseStatusDto.prototype, "lesson_number", void 0);
__decorate([
    ApiProperty({ description: 'Lesson theory content', required: false }),
    __metadata("design:type", Object)
], LessonWithExerciseStatusDto.prototype, "theory", void 0);
__decorate([
    ApiProperty({ description: 'Exercises with completion status', type: [ExerciseWithStatusDto] }),
    __metadata("design:type", Array)
], LessonWithExerciseStatusDto.prototype, "exercises", void 0);
__decorate([
    ApiProperty({ description: 'Speaking exercise with completion status', type: SpeakingWithStatusDto, required: false }),
    __metadata("design:type", SpeakingWithStatusDto)
], LessonWithExerciseStatusDto.prototype, "speaking", void 0);
__decorate([
    ApiProperty({ description: 'Vocabulary sets with completion status', type: [VocabularyWithStatusDto] }),
    __metadata("design:type", Array)
], LessonWithExerciseStatusDto.prototype, "lesson_vocabulary", void 0);
export class HomeworkWithExerciseStatusDto {
}
__decorate([
    ApiProperty({ description: 'Homework ID' }),
    __metadata("design:type", String)
], HomeworkWithExerciseStatusDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ description: 'Lesson ID' }),
    __metadata("design:type", String)
], HomeworkWithExerciseStatusDto.prototype, "lesson_id", void 0);
__decorate([
    ApiProperty({ description: 'Group ID' }),
    __metadata("design:type", String)
], HomeworkWithExerciseStatusDto.prototype, "group_id", void 0);
__decorate([
    ApiProperty({ description: 'Teacher ID' }),
    __metadata("design:type", String)
], HomeworkWithExerciseStatusDto.prototype, "teacher_id", void 0);
__decorate([
    ApiProperty({ description: 'Homework title' }),
    __metadata("design:type", String)
], HomeworkWithExerciseStatusDto.prototype, "title", void 0);
__decorate([
    ApiProperty({ description: 'Start date' }),
    __metadata("design:type", Date)
], HomeworkWithExerciseStatusDto.prototype, "start_date", void 0);
__decorate([
    ApiProperty({ description: 'Deadline' }),
    __metadata("design:type", Date)
], HomeworkWithExerciseStatusDto.prototype, "deadline", void 0);
__decorate([
    ApiProperty({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], HomeworkWithExerciseStatusDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty({ description: 'Update timestamp' }),
    __metadata("design:type", Date)
], HomeworkWithExerciseStatusDto.prototype, "updatedAt", void 0);
__decorate([
    ApiProperty({ description: 'Associated lesson with exercise status', type: LessonWithExerciseStatusDto }),
    __metadata("design:type", LessonWithExerciseStatusDto)
], HomeworkWithExerciseStatusDto.prototype, "lesson", void 0);
__decorate([
    ApiProperty({ description: 'Overall homework completion status', enum: ['finished', 'unfinished'] }),
    __metadata("design:type", String)
], HomeworkWithExerciseStatusDto.prototype, "homeworkStatus", void 0);
__decorate([
    ApiProperty({ description: 'Number of submissions for this homework' }),
    __metadata("design:type", Number)
], HomeworkWithExerciseStatusDto.prototype, "submissionCount", void 0);
__decorate([
    ApiProperty({ description: 'Whether homework is overdue' }),
    __metadata("design:type", Boolean)
], HomeworkWithExerciseStatusDto.prototype, "isOverdue", void 0);
__decorate([
    ApiProperty({ description: 'Whether homework is currently active (for active homeworks endpoint)', required: false }),
    __metadata("design:type", Boolean)
], HomeworkWithExerciseStatusDto.prototype, "isActive", void 0);
//# sourceMappingURL=homework-with-exercise-status.dto.js.map