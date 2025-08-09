import { PartialType } from '@nestjs/mapped-types';
import { CreateUnitVocabularySetDto } from './create-unit_vocabulary_set.dto.js';

export class UpdateUnitVocabularySetDto extends PartialType(CreateUnitVocabularySetDto) {}
