import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsOptional,
  IsEnum,
  IsString,
  IsBoolean,
  IsObject,
  Min,
  Max,
} from 'class-validator';

export class CreateExamResultDto {
  @ApiProperty({
    description: 'UUID of the exam',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  exam_id: string;

  @ApiProperty({
    description: 'UUID of the student',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({
    description: 'Score received in the exam',
    example: 85,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  score: number;

  @ApiProperty({
    description: 'Maximum possible score',
    example: 100,
    default: 100,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  max_score?: number;

  @ApiProperty({
    description: 'Score as a percentage',
    example: 85.5,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  percentage?: number;

  @ApiProperty({
    description: 'Final result of the exam',
    enum: ['passed', 'failed'],
    example: 'passed',
  })
  @IsEnum(['passed', 'failed'])
  @IsOptional()
  result?: 'passed' | 'failed';

  @ApiProperty({
    description: 'Individual scores for each section',
    example: {
      reading: 90,
      writing: 85,
      listening: 80,
      speaking: 75,
      grammar: 85,
      vocabulary: 90,
    },
  })
  @IsObject()
  @IsOptional()
  section_scores?: {
    reading?: number;
    writing?: number;
    listening?: number;
    speaking?: number;
    grammar?: number;
    vocabulary?: number;
  };

  @ApiProperty({
    description: 'Teacher feedback on the exam',
    example: 'Good performance overall. Needs to improve listening skills.',
  })
  @IsString()
  @IsOptional()
  feedback?: string;

  @ApiProperty({
    description: 'Whether the exam is completed by the student',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_completed?: boolean;
}
