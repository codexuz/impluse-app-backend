import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateLessonProgressDto {
  @ApiProperty({ description: 'ID of the student' })
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({ description: 'ID of the lesson' })
  @IsUUID()
  @IsNotEmpty()
  lesson_id: string;

  @ApiProperty({ description: 'Whether the lesson is completed', default: true })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
