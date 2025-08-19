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
import { IsNotEmpty, IsString, IsUUID, IsUrl } from 'class-validator';
export class CreateIeltspart1QuestionDto {
}
__decorate([
    ApiProperty({
        description: 'UUID of the speaking test',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateIeltspart1QuestionDto.prototype, "speaking_id", void 0);
__decorate([
    ApiProperty({
        description: 'The IELTS Part 1 question text',
        example: 'What kind of food do you like to eat?'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateIeltspart1QuestionDto.prototype, "question", void 0);
__decorate([
    ApiProperty({
        description: 'URL of the audio file for the question',
        example: 'https://storage.example.com/audio/question1.mp3'
    }),
    IsUrl(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateIeltspart1QuestionDto.prototype, "audio_url", void 0);
__decorate([
    ApiProperty({
        description: 'Sample answer for the question',
        example: 'I really enjoy eating various types of Asian cuisine, particularly Japanese food...'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateIeltspart1QuestionDto.prototype, "sample_answer", void 0);
//# sourceMappingURL=create-ieltspart1-question.dto.js.map