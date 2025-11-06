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
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsBoolean, IsEnum, IsUrl } from 'class-validator';
export var ExerciseType;
(function (ExerciseType) {
    ExerciseType["GRAMMAR"] = "grammar";
    ExerciseType["READING"] = "reading";
    ExerciseType["LISTENING"] = "listening";
    ExerciseType["WRITING"] = "writing";
})(ExerciseType || (ExerciseType = {}));
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
//# sourceMappingURL=create-exercise.dto.js.map