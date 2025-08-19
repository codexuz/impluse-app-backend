var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VocabularyProgressStatus } from '../enums/vocabulary-progress-status.enum.js';
export class CreateStudentVocabularyProgressDto {
    constructor() {
        this.status = VocabularyProgressStatus.LEARNING;
    }
}
__decorate([
    ApiProperty({
        description: 'The UUID of the student',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateStudentVocabularyProgressDto.prototype, "student_id", void 0);
__decorate([
    ApiProperty({
        description: 'The UUID of the vocabulary item',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateStudentVocabularyProgressDto.prototype, "vocabulary_item_id", void 0);
__decorate([
    ApiProperty({
        description: 'The learning status of the vocabulary item',
        enum: VocabularyProgressStatus,
        example: VocabularyProgressStatus.LEARNING,
        default: VocabularyProgressStatus.LEARNING
    }),
    IsEnum(VocabularyProgressStatus),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateStudentVocabularyProgressDto.prototype, "status", void 0);
//# sourceMappingURL=create-student-vocabulary-progress.dto.js.map