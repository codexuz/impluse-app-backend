import { ApiProperty } from '@nestjs/swagger';

export class ExerciseWithStatusDto {
  @ApiProperty({ description: 'Exercise ID' })
  id: string;

  @ApiProperty({ description: 'Exercise type' })
  exercise_type: string;

  @ApiProperty({ description: 'Lesson ID' })
  lesson_id: string;

  @ApiProperty({ description: 'Exercise completion status', enum: ['finished', 'unfinished'] })
  status: 'finished' | 'unfinished';

  @ApiProperty({ description: 'Associated submission data', required: false })
  submission?: {
    id: string;
    homework_id: string;
    student_id: string;
    percentage: number;
    status: string;
    section: string;
  } | null;
}

export class SpeakingWithStatusDto {
  @ApiProperty({ description: 'Speaking exercise ID' })
  id: string;

  @ApiProperty({ description: 'Lesson ID' })
  lesson_id: string;

  @ApiProperty({ description: 'Speaking exercise completion status', enum: ['finished', 'unfinished'] })
  status: 'finished' | 'unfinished';

  @ApiProperty({ description: 'Associated submission data', required: false })
  submission?: {
    id: string;
    homework_id: string;
    student_id: string;
    percentage: number;
    status: string;
    section: string;
  } | null;
}

export class VocabularyWithStatusDto {
  @ApiProperty({ description: 'Vocabulary set ID' })
  id: string;

  @ApiProperty({ description: 'Lesson ID' })
  lesson_id: string;

  @ApiProperty({ description: 'Vocabulary completion status', enum: ['finished', 'unfinished'] })
  status: 'finished' | 'unfinished';

  @ApiProperty({ description: 'Associated submission data', required: false })
  submission?: {
    id: string;
    homework_id: string;
    student_id: string;
    percentage: number;
    status: string;
    section: string;
  } | null;
}

export class LessonWithExerciseStatusDto {
  @ApiProperty({ description: 'Lesson ID' })
  id: string;

  @ApiProperty({ description: 'Lesson title' })
  title: string;

  @ApiProperty({ description: 'Lesson number' })
  lesson_number: number;

  @ApiProperty({ description: 'Lesson theory content', required: false })
  theory?: any;

  @ApiProperty({ description: 'Exercises with completion status', type: [ExerciseWithStatusDto] })
  exercises: ExerciseWithStatusDto[];

  @ApiProperty({ description: 'Speaking exercise with completion status', type: SpeakingWithStatusDto, required: false })
  speaking?: SpeakingWithStatusDto;

  @ApiProperty({ description: 'Vocabulary sets with completion status', type: [VocabularyWithStatusDto] })
  lesson_vocabulary: VocabularyWithStatusDto[];
}

export class HomeworkWithExerciseStatusDto {
  @ApiProperty({ description: 'Homework ID' })
  id: string;

  @ApiProperty({ description: 'Lesson ID' })
  lesson_id: string;

  @ApiProperty({ description: 'Group ID' })
  group_id: string;

  @ApiProperty({ description: 'Teacher ID' })
  teacher_id: string;

  @ApiProperty({ description: 'Homework title' })
  title: string;

  @ApiProperty({ description: 'Start date' })
  start_date: Date;

  @ApiProperty({ description: 'Deadline' })
  deadline: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Update timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: 'Associated lesson with exercise status', type: LessonWithExerciseStatusDto })
  lesson: LessonWithExerciseStatusDto;

  @ApiProperty({ description: 'Overall homework completion status', enum: ['finished', 'unfinished'] })
  homeworkStatus: 'finished' | 'unfinished';

  @ApiProperty({ description: 'Number of submissions for this homework' })
  submissionCount: number;

  @ApiProperty({ description: 'Whether homework is overdue' })
  isOverdue: boolean;

  @ApiProperty({ description: 'Whether homework is currently active (for active homeworks endpoint)', required: false })
  isActive?: boolean;
}
