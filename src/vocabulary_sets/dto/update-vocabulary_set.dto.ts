import { PartialType } from '@nestjs/mapped-types';
import { CreateVocabularySetDto } from './create-vocabulary_set.dto.js';

export class UpdateVocabularySetDto extends PartialType(CreateVocabularySetDto) {}
