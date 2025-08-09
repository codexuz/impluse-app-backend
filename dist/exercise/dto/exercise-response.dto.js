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
export class ChoiceResponseDto {
}
__decorate([
    ApiProperty({ description: 'Choice ID' }),
    __metadata("design:type", String)
], ChoiceResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ description: 'Question ID' }),
    __metadata("design:type", String)
], ChoiceResponseDto.prototype, "question_id", void 0);
__decorate([
    ApiProperty({ description: 'Option text' }),
    __metadata("design:type", String)
], ChoiceResponseDto.prototype, "option_text", void 0);
__decorate([
    ApiProperty({ description: 'Is correct answer' }),
    __metadata("design:type", Boolean)
], ChoiceResponseDto.prototype, "is_correct", void 0);
export class GapFillingResponseDto {
}
__decorate([
    ApiProperty({ description: 'Gap filling ID' }),
    __metadata("design:type", String)
], GapFillingResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ description: 'Question ID' }),
    __metadata("design:type", String)
], GapFillingResponseDto.prototype, "question_id", void 0);
__decorate([
    ApiProperty({ description: 'Gap number' }),
    __metadata("design:type", Number)
], GapFillingResponseDto.prototype, "gap_number", void 0);
__decorate([
    ApiProperty({ description: 'Correct answers', type: [String] }),
    __metadata("design:type", Array)
], GapFillingResponseDto.prototype, "correct_answer", void 0);
export class MatchingPairResponseDto {
}
__decorate([
    ApiProperty({ description: 'Matching pair ID' }),
    __metadata("design:type", String)
], MatchingPairResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ description: 'Question ID' }),
    __metadata("design:type", String)
], MatchingPairResponseDto.prototype, "question_id", void 0);
__decorate([
    ApiProperty({ description: 'Left item' }),
    __metadata("design:type", String)
], MatchingPairResponseDto.prototype, "left_item", void 0);
__decorate([
    ApiProperty({ description: 'Right item' }),
    __metadata("design:type", String)
], MatchingPairResponseDto.prototype, "right_item", void 0);
__decorate([
    ApiProperty({ description: 'Created at' }),
    __metadata("design:type", Date)
], MatchingPairResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty({ description: 'Updated at' }),
    __metadata("design:type", Date)
], MatchingPairResponseDto.prototype, "updatedAt", void 0);
export class TypingExerciseResponseDto {
}
__decorate([
    ApiProperty({ description: 'Typing exercise ID' }),
    __metadata("design:type", String)
], TypingExerciseResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ description: 'Question ID' }),
    __metadata("design:type", String)
], TypingExerciseResponseDto.prototype, "question_id", void 0);
__decorate([
    ApiProperty({ description: 'Correct answer' }),
    __metadata("design:type", String)
], TypingExerciseResponseDto.prototype, "correct_answer", void 0);
__decorate([
    ApiProperty({ description: 'Is case sensitive' }),
    __metadata("design:type", Boolean)
], TypingExerciseResponseDto.prototype, "is_case_sensitive", void 0);
__decorate([
    ApiProperty({ description: 'Created at' }),
    __metadata("design:type", Date)
], TypingExerciseResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty({ description: 'Updated at' }),
    __metadata("design:type", Date)
], TypingExerciseResponseDto.prototype, "updatedAt", void 0);
export class QuestionResponseDto {
}
__decorate([
    ApiProperty({ description: 'Question ID' }),
    __metadata("design:type", String)
], QuestionResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ description: 'Exercise ID' }),
    __metadata("design:type", String)
], QuestionResponseDto.prototype, "exercise_id", void 0);
__decorate([
    ApiProperty({ description: 'Question type', enum: ['multiple_choice', 'fill_in_the_blank', 'true_false', 'short_answer', 'matching', 'sentence_build'] }),
    __metadata("design:type", String)
], QuestionResponseDto.prototype, "question_type", void 0);
__decorate([
    ApiProperty({ description: 'Question text' }),
    __metadata("design:type", String)
], QuestionResponseDto.prototype, "question_text", void 0);
__decorate([
    ApiProperty({ description: 'Points', required: false }),
    __metadata("design:type", Number)
], QuestionResponseDto.prototype, "points", void 0);
__decorate([
    ApiProperty({ description: 'Order number' }),
    __metadata("design:type", Number)
], QuestionResponseDto.prototype, "order_number", void 0);
__decorate([
    ApiProperty({ description: 'Sample answer', required: false }),
    __metadata("design:type", String)
], QuestionResponseDto.prototype, "sample_answer", void 0);
__decorate([
    ApiProperty({ description: 'Created at' }),
    __metadata("design:type", Date)
], QuestionResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty({ description: 'Updated at' }),
    __metadata("design:type", Date)
], QuestionResponseDto.prototype, "updatedAt", void 0);
__decorate([
    ApiProperty({ description: 'Choices for multiple choice questions', required: false, type: [ChoiceResponseDto] }),
    __metadata("design:type", Array)
], QuestionResponseDto.prototype, "choices", void 0);
__decorate([
    ApiProperty({ description: 'Gap filling data for fill in the blank questions', required: false, type: [GapFillingResponseDto] }),
    __metadata("design:type", Array)
], QuestionResponseDto.prototype, "gapFilling", void 0);
__decorate([
    ApiProperty({ description: 'Matching pairs for matching questions', required: false, type: [MatchingPairResponseDto] }),
    __metadata("design:type", Array)
], QuestionResponseDto.prototype, "matchingPairs", void 0);
__decorate([
    ApiProperty({ description: 'Typing exercise data for typing questions', required: false, type: TypingExerciseResponseDto }),
    __metadata("design:type", TypingExerciseResponseDto)
], QuestionResponseDto.prototype, "typingExercise", void 0);
export class ExerciseResponseDto {
}
__decorate([
    ApiProperty({ description: 'Exercise ID' }),
    __metadata("design:type", String)
], ExerciseResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ description: 'Exercise title' }),
    __metadata("design:type", String)
], ExerciseResponseDto.prototype, "title", void 0);
__decorate([
    ApiProperty({ description: 'Exercise type', enum: ['grammar', 'reading', 'listening', 'writing'] }),
    __metadata("design:type", String)
], ExerciseResponseDto.prototype, "exercise_type", void 0);
__decorate([
    ApiProperty({ description: 'Audio URL', required: false }),
    __metadata("design:type", String)
], ExerciseResponseDto.prototype, "audio_url", void 0);
__decorate([
    ApiProperty({ description: 'Image URL', required: false }),
    __metadata("design:type", String)
], ExerciseResponseDto.prototype, "image_url", void 0);
__decorate([
    ApiProperty({ description: 'Instructions', required: false }),
    __metadata("design:type", String)
], ExerciseResponseDto.prototype, "instructions", void 0);
__decorate([
    ApiProperty({ description: 'Content', required: false }),
    __metadata("design:type", String)
], ExerciseResponseDto.prototype, "content", void 0);
__decorate([
    ApiProperty({ description: 'Is active' }),
    __metadata("design:type", Boolean)
], ExerciseResponseDto.prototype, "isActive", void 0);
__decorate([
    ApiProperty({ description: 'Lesson ID', required: false }),
    __metadata("design:type", String)
], ExerciseResponseDto.prototype, "lessonId", void 0);
__decorate([
    ApiProperty({ description: 'Created at' }),
    __metadata("design:type", Date)
], ExerciseResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty({ description: 'Updated at' }),
    __metadata("design:type", Date)
], ExerciseResponseDto.prototype, "updatedAt", void 0);
__decorate([
    ApiProperty({ description: 'Questions for this exercise', required: false, type: [QuestionResponseDto] }),
    __metadata("design:type", Array)
], ExerciseResponseDto.prototype, "questions", void 0);
//# sourceMappingURL=exercise-response.dto.js.map