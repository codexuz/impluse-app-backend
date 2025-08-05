import { ApiProperty } from '@nestjs/swagger';

export class SupportScheduleResponseDto {
  @ApiProperty({
    description: 'Support schedule ID',
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  id: string;

  @ApiProperty({
    description: 'Support teacher ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  support_teacher_id: string;

  @ApiProperty({
    description: 'Group ID for the support schedule',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  group_id: string;

  @ApiProperty({
    description: 'Schedule date',
    example: '2024-01-25T00:00:00Z'
  })
  schedule_date: Date;

  @ApiProperty({
    description: 'Start time for the support session',
    example: '2024-01-25T14:00:00Z'
  })
  start_time: Date;

  @ApiProperty({
    description: 'End time for the support session',
    example: '2024-01-25T15:30:00Z'
  })
  end_time: Date;

  @ApiProperty({
    description: 'Topic of the support session',
    example: 'Grammar review and practice'
  })
  topic: string;

  @ApiProperty({
    description: 'Additional notes about the support session',
    example: 'Focus on present perfect tense',
    nullable: true
  })
  notes: string | null;

  @ApiProperty({
    description: 'Record creation timestamp',
    example: '2024-01-25T10:00:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Record last update timestamp',
    example: '2024-01-25T10:00:00Z'
  })
  updatedAt: Date;
}
