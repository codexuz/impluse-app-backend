import { IsString, IsNotEmpty, IsUUID, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late'
}

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
    description: 'The ID of the student for this attendance record',
    example: '987fcdeb-51a2-43d1-9b23-456789012345',
    format: 'uuid'
  })
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({
    description: 'The ID of the teacher taking attendance',
    example: 'abc12345-def6-789g-hij0-123456789012',
    format: 'uuid'
  })
  @IsUUID()
  @IsNotEmpty()
  teacher_id: string;

  @ApiProperty({
    description: 'The attendance status of the student',
    example: 'present',
    enum: AttendanceStatus
  })
  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;

  @ApiProperty({
    description: 'Additional notes about the attendance',
    example: 'Student arrived 10 minutes late due to traffic',
    required: false
  })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({
    description: 'The date of the attendance record (YYYY-MM-DD format)',
    example: '2024-01-15',
    format: 'date'
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
