import { ApiProperty } from '@nestjs/swagger';
import { Exercise } from '../entities/exercise.entity.js';
import { Questions } from '../entities/questions.js';
import { Choices } from '../entities/choices.js';
import { GapFilling } from '../entities/gap_filling.js';
import { MatchingExercise } from '../entities/matching_pairs.js';
import { TypingExercise } from '../entities/typing_answers.js';

// First, declare all the dependent classes
export class ChoiceResponseDto {
  @ApiProperty({ description: 'Choice ID' })
  id: string;

  @ApiProperty({ description: 'Question ID' })
  question_id: string;

  @ApiProperty({ description: 'Option text' })
  option_text: string;

  @ApiProperty({ description: 'Is correct answer' })
  is_correct: boolean;
}

export class GapFillingResponseDto {
  @ApiProperty({ description: 'Gap filling ID' })
  id: string;

  @ApiProperty({ description: 'Question ID' })
  question_id: string;

  @ApiProperty({ description: 'Gap number' })
  gap_number: number;

  @ApiProperty({ description: 'Correct answers', type: [String] })
  correct_answer: string[];
}

export class MatchingPairResponseDto {
  @ApiProperty({ description: 'Matching pair ID' })
  id: string;

  @ApiProperty({ description: 'Question ID' })
  question_id: string;

  @ApiProperty({ description: 'Left item' })
  left_item: string;

  @ApiProperty({ description: 'Right item' })
  right_item: string;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;
}

export class TypingExerciseResponseDto {
  @ApiProperty({ description: 'Typing exercise ID' })
  id: string;

  @ApiProperty({ description: 'Question ID' })
  question_id: string;

  @ApiProperty({ description: 'Correct answer' })
  correct_answer: string;

  @ApiProperty({ description: 'Is case sensitive' })
  is_case_sensitive: boolean;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;
}

// Now declare QuestionResponseDto that uses the above classes
export class QuestionResponseDto {
  @ApiProperty({ description: 'Question ID' })
  id: string;

  @ApiProperty({ description: 'Exercise ID' })
  exercise_id: string;

  @ApiProperty({ description: 'Question type', enum: ['multiple_choice', 'fill_in_the_blank', 'true_false', 'short_answer', 'matching', 'sentence_build'] })
  question_type: string;

  @ApiProperty({ description: 'Question text' })
  question_text: string;

  @ApiProperty({ description: 'Points', required: false })
  points?: number;

  @ApiProperty({ description: 'Order number' })
  order_number: number;

  @ApiProperty({ description: 'Sample answer', required: false })
  sample_answer?: string;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;

  @ApiProperty({ description: 'Choices for multiple choice questions', required: false, type: [ChoiceResponseDto] })
  choices?: ChoiceResponseDto[];

  @ApiProperty({ description: 'Gap filling data for fill in the blank questions', required: false, type: [GapFillingResponseDto] })
  gapFilling?: GapFillingResponseDto[];

  @ApiProperty({ description: 'Matching pairs for matching questions', required: false, type: [MatchingPairResponseDto] })
  matchingPairs?: MatchingPairResponseDto[];

  @ApiProperty({ description: 'Typing exercise data for typing questions', required: false, type: TypingExerciseResponseDto })
  typingExercise?: TypingExerciseResponseDto;
}

// Finally, declare ExerciseResponseDto
export class ExerciseResponseDto {
  @ApiProperty({ description: 'Exercise ID' })
  id: string;

  @ApiProperty({ description: 'Exercise title' })
  title: string;

  @ApiProperty({ description: 'Exercise type', enum: ['grammar', 'reading', 'listening', 'writing'] })
  exercise_type: string;

  @ApiProperty({ description: 'Audio URL', required: false })
  audio_url?: string;

  @ApiProperty({ description: 'Image URL', required: false })
  image_url?: string;

  @ApiProperty({ description: 'Instructions', required: false })
  instructions?: string;

  @ApiProperty({ description: 'Content', required: false })
  content?: string;

  @ApiProperty({ description: 'Is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Lesson ID', required: false })
  lessonId?: string;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;

  @ApiProperty({ description: 'Questions for this exercise', required: false, type: [QuestionResponseDto] })
  questions?: QuestionResponseDto[];
}
