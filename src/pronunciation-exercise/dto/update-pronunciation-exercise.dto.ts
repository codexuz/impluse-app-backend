import { PartialType } from '@nestjs/mapped-types';
import { CreatePronunciationExerciseDto } from './create-pronunciation-exercise.dto.js';

export class UpdatePronunciationExerciseDto extends PartialType(CreatePronunciationExerciseDto) {}
