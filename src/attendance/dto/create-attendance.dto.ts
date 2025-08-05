import { IsString, IsNotEmpty, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty({
    description: 'The ID of the group for this attendance record',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID()
  @IsNotEmpty()
  group_id: string;

  @ApiProperty({
    description: 'The ID of the lesson for this attendance record',
    example: '987fcdeb-51a2-43d1-9b23-456789012345',
    format: 'uuid'
  })
  @IsUUID()
  @IsNotEmpty()
  lesson_id: string;

  @ApiProperty({
    description: 'The ID of the teacher taking attendance',
    example: 'abc12345-def6-789g-hij0-123456789012',
    format: 'uuid'
  })
  @IsUUID()
  @IsNotEmpty()
  teacher_id: string;

  @ApiProperty({
    description: 'The date of the attendance record',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time'
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
