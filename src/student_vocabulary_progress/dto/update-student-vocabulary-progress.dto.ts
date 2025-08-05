import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateStudentVocabularyProgressDto } from './create-student-vocabulary-progress.dto.js';
import { VocabularyProgressStatus } from '../enums/vocabulary-progress-status.enum.js';

export class UpdateStudentVocabularyProgressDto extends PartialType(CreateStudentVocabularyProgressDto) {
    @ApiPropertyOptional({
        description: 'The updated learning status of the vocabulary item',
        enum: VocabularyProgressStatus,
        example: VocabularyProgressStatus.MASTERED
    })
    @IsEnum(VocabularyProgressStatus)
    @IsOptional()
    status?: VocabularyProgressStatus;
}
