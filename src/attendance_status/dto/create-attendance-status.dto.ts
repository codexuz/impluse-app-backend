import { IsString, IsNotEmpty, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum AttendanceStatusEnum {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late'
}

export class CreateAttendanceStatusDto {
  @ApiProperty({
    description: 'The ID of the attendance record this status belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID()
  @IsNotEmpty()
  attendance_id: string;

  @ApiProperty({
    description: 'The ID of the student for this attendance status',
    example: '987fcdeb-51a2-43d1-9b23-456789012345',
    format: 'uuid'
  })
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({
    description: 'The attendance status of the student',
    enum: AttendanceStatusEnum,
    example: 'present',
    enumName: 'AttendanceStatusEnum'
  })
  @IsEnum(AttendanceStatusEnum)
  @IsNotEmpty()
  status: 'present' | 'absent' | 'late';

  @ApiProperty({
    description: 'Additional notes about the attendance status',
    example: 'Student arrived 15 minutes late due to traffic',
    required: false
  })
  @IsString()
  @IsOptional()
  note?: string;
}
