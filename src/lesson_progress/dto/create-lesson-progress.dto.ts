import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsUUID, IsNumber, Min, Max } from 'class-validator';

export class CreateLessonProgressDto {
  @ApiProperty({ description: 'ID of the student' })
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({ description: 'ID of the lesson' })
  @IsUUID()
  @IsNotEmpty()
  lesson_id: string;

  @ApiProperty({ description: 'Whether the lesson is completed', default: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiProperty({ description: 'Progress percentage', default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @IsOptional()
  progress_percentage?: number;

  @ApiProperty({ description: 'Whether reading section is completed', default: false })
  @IsBoolean()
  @IsOptional()
  reading_completed?: boolean;

  @ApiProperty({ description: 'Whether listening section is completed', default: false })
  @IsBoolean()
  @IsOptional()
  listening_completed?: boolean;

  @ApiProperty({ description: 'Whether grammar section is completed', default: false })
  @IsBoolean()
  @IsOptional()
  grammar_completed?: boolean;

  @ApiProperty({ description: 'Whether writing section is completed', default: false })
  @IsBoolean()
  @IsOptional()
  writing_completed?: boolean;

  @ApiProperty({ description: 'Whether speaking section is completed', default: false })
  @IsBoolean()
  @IsOptional()
  speaking_completed?: boolean;
}
