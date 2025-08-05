import { PartialType } from '@nestjs/swagger';
import { 
  CreateCompleteExerciseDto, 
  CreateCompleteQuestionDto,
  CreateChoiceDto, 
  CreateGapFillingDto, 
  CreateMatchingPairDto, 
  CreateTypingExerciseDto,
  CreateQuestionDto
} from './create-complete-exercise.dto.js';

export class UpdateExerciseDto extends PartialType(CreateCompleteExerciseDto) {}

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}

export class UpdateCompleteQuestionDto extends PartialType(CreateCompleteQuestionDto) {}

export class UpdateChoiceDto extends PartialType(CreateChoiceDto) {}

export class UpdateGapFillingDto extends PartialType(CreateGapFillingDto) {}

export class UpdateMatchingPairDto extends PartialType(CreateMatchingPairDto) {}

export class UpdateTypingExerciseDto extends PartialType(CreateTypingExerciseDto) {}
