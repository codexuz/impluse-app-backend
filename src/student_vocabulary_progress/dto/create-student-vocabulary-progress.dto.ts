import { IsNotEmpty, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VocabularyProgressStatus } from '../enums/vocabulary-progress-status.enum.js';

export class CreateStudentVocabularyProgressDto {
    @ApiProperty({
        description: 'The UUID of the student',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    student_id: string;

    @ApiProperty({
        description: 'The UUID of the vocabulary item',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    vocabulary_item_id: string;

    @ApiProperty({
        description: 'The learning status of the vocabulary item',
        enum: VocabularyProgressStatus,
        example: VocabularyProgressStatus.LEARNING,
        default: VocabularyProgressStatus.LEARNING
    })
    @IsEnum(VocabularyProgressStatus)
    @IsOptional()
    status: VocabularyProgressStatus = VocabularyProgressStatus.LEARNING;
}
