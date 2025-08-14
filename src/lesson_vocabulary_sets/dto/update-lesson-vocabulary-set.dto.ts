import { PartialType } from '@nestjs/swagger';
import { CreateLessonVocabularySetDto } from './create-lesson-vocabulary-set.dto.js';

export class UpdateLessonVocabularySetDto extends PartialType(CreateLessonVocabularySetDto) {}
