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
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
export class CreatePronunciationExerciseDto {
}
__decorate([
    ApiProperty({
        description: 'The ID of the speaking exercise this pronunciation exercise belongs to',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreatePronunciationExerciseDto.prototype, "speaking_id", void 0);
__decorate([
    ApiProperty({
        description: 'The word or phrase that needs to be pronounced',
        example: 'pronunciation'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreatePronunciationExerciseDto.prototype, "word_to_pronunce", void 0);
__decorate([
    ApiProperty({
        description: 'The URL of the audio file containing the correct pronunciation',
        example: 'https://storage.example.com/audio/pronunciation.mp3'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreatePronunciationExerciseDto.prototype, "audio_url", void 0);
//# sourceMappingURL=create-pronunciation-exercise.dto.js.map