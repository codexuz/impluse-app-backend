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
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsBoolean, IsEnum, IsInt, IsUrl, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
export var ExerciseType;
(function (ExerciseType) {
    ExerciseType["GRAMMAR"] = "grammar";
    ExerciseType["READING"] = "reading";
    ExerciseType["LISTENING"] = "listening";
    ExerciseType["WRITING"] = "writing";
})(ExerciseType || (ExerciseType = {}));
export var QuestionType;
(function (QuestionType) {
    QuestionType["MULTIPLE_CHOICE"] = "multiple_choice";
    QuestionType["FILL_IN_THE_BLANK"] = "fill_in_the_blank";
    QuestionType["TRUE_FALSE"] = "true_false";
    QuestionType["SHORT_ANSWER"] = "short_answer";
    QuestionType["MATCHING"] = "matching";
})(QuestionType || (QuestionType = {}));
export class CreateSentenceBuildDto {
}
__decorate([
    ApiProperty({
        description: 'Text given to the student to build the sentence',
        example: 'the dog brown quick jumps over the lazy fox',
        required: true
    }),
    IsString({ message: 'given_text must be a string' }),
    IsNotEmpty({ message: 'given_text should not be empty' }),
    __metadata("design:type", String)
], CreateSentenceBuildDto.prototype, "given_text", void 0);
__decorate([
    ApiProperty({
        description: 'Correct answer for the sentence build',
        example: 'The quick brown fox jumps over the lazy dog',
        required: true
    }),
    IsString({ message: 'correct_answer must be a string' }),
    IsNotEmpty({ message: 'correct_answer should not be empty' }),
    __metadata("design:type", String)
], CreateSentenceBuildDto.prototype, "correct_answer", void 0);
export class CreateExerciseDto {
}
__decorate([
    ApiProperty({
        description: 'Title of the exercise',
        example: 'Present Simple Grammar Exercise'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateExerciseDto.prototype, "title", void 0);
__decorate([
    ApiProperty({
        description: 'Type of the exercise',
        enum: ExerciseType,
        example: ExerciseType.GRAMMAR
    }),
    IsEnum(ExerciseType),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateExerciseDto.prototype, "exercise_type", void 0);
__decorate([
    ApiProperty({
        description: 'Audio URL for the exercise',
        required: false,
        example: 'https://example.com/audio.mp3'
    }),
    IsUrl(),
    IsOptional(),
    __metadata("design:type", String)
], CreateExerciseDto.prototype, "audio_url", void 0);
__decorate([
    ApiProperty({
        description: 'Image URL for the exercise',
        required: false,
        example: 'https://example.com/image.jpg'
    }),
    IsUrl(),
    IsOptional(),
    __metadata("design:type", String)
], CreateExerciseDto.prototype, "image_url", void 0);
__decorate([
    ApiProperty({
        description: 'Instructions for the exercise',
        required: false,
        example: 'Choose the correct answer'
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateExerciseDto.prototype, "instructions", void 0);
__decorate([
    ApiProperty({
        description: 'Content of the exercise',
        required: false,
        example: 'She ___ to school every day.'
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateExerciseDto.prototype, "content", void 0);
__decorate([
    ApiProperty({
        description: 'Whether the exercise is active',
        default: true,
        required: false
    }),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateExerciseDto.prototype, "isActive", void 0);
__decorate([
    ApiProperty({
        description: 'ID of the lesson this exercise belongs to',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], CreateExerciseDto.prototype, "lessonId", void 0);
export class CreateQuestionDto {
}
__decorate([
    ApiProperty({
        description: 'Type of the question',
        enum: QuestionType,
        example: QuestionType.MULTIPLE_CHOICE
    }),
    IsEnum(QuestionType),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateQuestionDto.prototype, "question_type", void 0);
__decorate([
    ApiProperty({
        description: 'Question text',
        example: 'What is the correct form of the verb?'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateQuestionDto.prototype, "question_text", void 0);
__decorate([
    ApiProperty({
        description: 'Points awarded for this question',
        required: false,
        example: 10
    }),
    IsInt(),
    IsOptional(),
    __metadata("design:type", Number)
], CreateQuestionDto.prototype, "points", void 0);
__decorate([
    ApiProperty({
        description: 'Order number of the question',
        example: 1
    }),
    IsInt(),
    IsNotEmpty(),
    __metadata("design:type", Number)
], CreateQuestionDto.prototype, "order_number", void 0);
__decorate([
    ApiProperty({
        description: 'Sample answer for the question',
        required: false,
        example: 'The correct answer is "goes" because...'
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateQuestionDto.prototype, "sample_answer", void 0);
export class CreateChoiceDto {
}
__decorate([
    ApiProperty({
        description: 'Option text',
        example: 'goes'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateChoiceDto.prototype, "option_text", void 0);
__decorate([
    ApiProperty({
        description: 'Whether this option is correct',
        example: true
    }),
    IsBoolean(),
    IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateChoiceDto.prototype, "is_correct", void 0);
export class CreateGapFillingDto {
}
__decorate([
    ApiProperty({
        description: 'Gap number in the question',
        example: 1
    }),
    IsInt(),
    IsNotEmpty(),
    __metadata("design:type", Number)
], CreateGapFillingDto.prototype, "gap_number", void 0);
__decorate([
    ApiProperty({
        description: 'Correct answers for the gap',
        example: ['goes', 'is going'],
        type: [String]
    }),
    IsArray(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreateGapFillingDto.prototype, "correct_answer", void 0);
export class CreateMatchingPairDto {
}
__decorate([
    ApiProperty({
        description: 'Left side item',
        example: 'cat'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateMatchingPairDto.prototype, "left_item", void 0);
__decorate([
    ApiProperty({
        description: 'Right side item',
        example: 'animal'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateMatchingPairDto.prototype, "right_item", void 0);
export class CreateTypingExerciseDto {
}
__decorate([
    ApiProperty({
        description: 'Correct answer for typing exercise',
        example: 'The quick brown fox jumps over the lazy dog'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateTypingExerciseDto.prototype, "correct_answer", void 0);
__decorate([
    ApiProperty({
        description: 'Whether the answer is case sensitive',
        example: false
    }),
    IsBoolean(),
    IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateTypingExerciseDto.prototype, "is_case_sensitive", void 0);
export class CreateCompleteQuestionDto extends CreateQuestionDto {
}
__decorate([
    ApiProperty({
        description: 'Choices for multiple choice questions',
        required: false,
        type: [CreateChoiceDto]
    }),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => CreateChoiceDto),
    IsOptional(),
    __metadata("design:type", Array)
], CreateCompleteQuestionDto.prototype, "choices", void 0);
__decorate([
    ApiProperty({
        description: 'Gap filling data for fill in the blank questions',
        required: false,
        type: [CreateGapFillingDto]
    }),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => CreateGapFillingDto),
    IsOptional(),
    __metadata("design:type", Array)
], CreateCompleteQuestionDto.prototype, "gap_filling", void 0);
__decorate([
    ApiProperty({
        description: 'Matching pairs for matching questions',
        required: false,
        type: [CreateMatchingPairDto]
    }),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => CreateMatchingPairDto),
    IsOptional(),
    __metadata("design:type", Array)
], CreateCompleteQuestionDto.prototype, "matching_pairs", void 0);
__decorate([
    ApiProperty({
        description: 'Typing exercise data for typing questions',
        required: false,
        type: CreateTypingExerciseDto
    }),
    ValidateNested(),
    Type(() => CreateTypingExerciseDto),
    IsOptional(),
    __metadata("design:type", CreateTypingExerciseDto)
], CreateCompleteQuestionDto.prototype, "typing_exercise", void 0);
__decorate([
    ApiProperty({
        description: 'Sentence build data for sentence build questions',
        required: false,
        type: CreateSentenceBuildDto,
        isArray: true
    }),
    ValidateNested({ each: true }),
    Type(() => CreateSentenceBuildDto),
    IsOptional(),
    __metadata("design:type", Object)
], CreateCompleteQuestionDto.prototype, "sentence_build", void 0);
export class CreateCompleteExerciseDto extends CreateExerciseDto {
}
__decorate([
    ApiProperty({
        description: 'Questions for this exercise',
        type: [CreateCompleteQuestionDto]
    }),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => CreateCompleteQuestionDto),
    IsNotEmpty(),
    __metadata("design:type", Array)
], CreateCompleteExerciseDto.prototype, "questions", void 0);
//# sourceMappingURL=create-complete-exercise.dto.js.map