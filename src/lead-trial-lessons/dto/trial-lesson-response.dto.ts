import { ApiProperty } from '@nestjs/swagger';

export class TrialLessonResponseDto {
  @ApiProperty({
    description: 'Trial lesson ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'Scheduled date and time for the trial lesson',
    example: '2024-01-20T14:00:00Z'
  })
  scheduledAt: Date;

  @ApiProperty({
    description: 'Trial lesson status',
    example: 'belgilangan'
  })
  status: string;

  @ApiProperty({
    description: 'Teacher ID assigned to the trial lesson',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  teacher_id: string;

  @ApiProperty({
    description: 'Lead ID for the trial lesson',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  lead_id: string;

  @ApiProperty({
    description: 'Additional notes about the trial lesson',
    example: 'Student is interested in business English'
  })
  notes: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-15T10:30:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-15T15:45:00Z'
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Deletion date (for soft delete)',
    example: null,
    required: false
  })
  deletedAt?: Date;
}

export class TrialLessonListResponseDto {
  @ApiProperty({
    description: 'Array of trial lessons',
    type: [TrialLessonResponseDto]
  })
  trialLessons: TrialLessonResponseDto[];

  @ApiProperty({
    description: 'Total number of trial lessons',
    example: 50
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5
  })
  totalPages: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  currentPage: number;
}

export class TrialLessonStatsResponseDto {
  @ApiProperty({
    description: 'Total number of trial lessons',
    example: 50
  })
  totalTrialLessons: number;

  @ApiProperty({
    description: 'Number of trial lessons by status',
    example: {
      'belgilangan': 20,
      'keldi': 15,
      'kelmadi': 15
    }
  })
  trialLessonsByStatus: { [key: string]: number };

  @ApiProperty({
    description: 'Number of trial lessons by teacher',
    example: {
      'teacher1': 25,
      'teacher2': 25
    }
  })
  trialLessonsByTeacher: { [key: string]: number };

  @ApiProperty({
    description: 'Upcoming trial lessons count',
    example: 10
  })
  upcomingTrialLessons: number;
}
