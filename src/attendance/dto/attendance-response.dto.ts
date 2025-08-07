import { ApiProperty } from '@nestjs/swagger';

export class AttendanceResponseDto {
  @ApiProperty({ description: 'Attendance record ID' })
  id: string;

  @ApiProperty({ description: 'Group ID' })
  group_id: string;

  @ApiProperty({ description: 'Student ID' })
  student_id: string;

  @ApiProperty({ description: 'Teacher ID' })
  teacher_id: string;

  @ApiProperty({ description: 'Attendance status', enum: ['present', 'absent', 'late'] })
  status: string;

  @ApiProperty({ description: 'Additional notes' })
  note: string;

  @ApiProperty({ description: 'Date of attendance record' })
  date: string;

  @ApiProperty({ description: 'Record creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  updatedAt: Date;
}

export class AttendanceStatsDto {
  @ApiProperty({ description: 'Total attendance records' })
  total: number;

  @ApiProperty({ description: 'Number of present records' })
  present: number;

  @ApiProperty({ description: 'Number of absent records' })
  absent: number;

  @ApiProperty({ description: 'Number of late records' })
  late: number;

  @ApiProperty({ description: 'Attendance rate percentage' })
  attendanceRate: string;
}
