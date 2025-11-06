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
import { IsEnum, IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';
export class CreateSpeakingResponseDto {
}
__decorate([
    ApiProperty({
        description: 'The speaking ID this response is associated with',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    __metadata("design:type", String)
], CreateSpeakingResponseDto.prototype, "speaking_id", void 0);
__decorate([
    ApiProperty({
        description: 'The student ID this response belongs to',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    __metadata("design:type", String)
], CreateSpeakingResponseDto.prototype, "student_id", void 0);
__decorate([
    ApiProperty({
        description: 'Type of speaking response',
        enum: ['part1', 'part2', 'part3', 'pronunciation'],
        example: 'part1'
    }),
    IsEnum(['part1', 'part2', 'part3', 'pronunciation']),
    __metadata("design:type", String)
], CreateSpeakingResponseDto.prototype, "response_type", void 0);
__decorate([
    ApiProperty({
        description: 'URLs to the audio recordings',
        example: ['https://storage.example.com/audio/recording-123.mp3'],
        required: false,
        isArray: true,
        type: [String]
    }),
    IsString({ each: true }),
    IsOptional(),
    __metadata("design:type", Array)
], CreateSpeakingResponseDto.prototype, "audio_url", void 0);
__decorate([
    ApiProperty({
        description: 'Transcription of the audio recording',
        example: 'In my opinion, the most important factor is...',
        required: false
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateSpeakingResponseDto.prototype, "transcription", void 0);
__decorate([
    ApiProperty({
        description: 'General assessment result data',
        required: false
    }),
    IsOptional(),
    __metadata("design:type", Object)
], CreateSpeakingResponseDto.prototype, "result", void 0);
__decorate([
    ApiProperty({
        description: 'Overall pronunciation score (0-100)',
        example: 85.5,
        required: false
    }),
    IsNumber(),
    IsOptional(),
    __metadata("design:type", Number)
], CreateSpeakingResponseDto.prototype, "pronunciation_score", void 0);
__decorate([
    ApiProperty({
        description: 'Feedback on errors and improvement suggestions',
        example: 'Work on your intonation for questions. Good vocabulary usage.',
        required: false
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateSpeakingResponseDto.prototype, "feedback", void 0);
//# sourceMappingURL=create-speaking-response.dto.js.map