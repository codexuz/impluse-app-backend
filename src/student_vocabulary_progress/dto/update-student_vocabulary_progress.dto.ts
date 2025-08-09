import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentVocabularyProgressDto } from './create-student_vocabulary_progress.dto.js';

export class UpdateStudentVocabularyProgressDto extends PartialType(CreateStudentVocabularyProgressDto) {}
