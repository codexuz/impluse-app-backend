import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsDateString, IsOptional } from 'class-validator';

export class CreateSupportScheduleDto {
  @ApiProperty({
    description: 'Support teacher ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  support_teacher_id: string;

  @ApiProperty({
    description: 'Group ID for the support schedule',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID()
  @IsNotEmpty()
  group_id: string;

  @ApiProperty({
    description: 'Schedule date',
    example: '2024-01-25T00:00:00Z'
  })
  @IsDateString()
  @IsNotEmpty()
  schedule_date: Date;

  @ApiProperty({
    description: 'Start time for the support session',
    example: '2024-01-25T14:00:00Z'
  })
  @IsDateString()
  @IsNotEmpty()
  start_time: Date;

  @ApiProperty({
    description: 'End time for the support session',
    example: '2024-01-25T15:30:00Z'
  })
  @IsDateString()
  @IsNotEmpty()
  end_time: Date;

  @ApiProperty({
    description: 'Topic of the support session',
    example: 'Grammar review and practice'
  })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiProperty({
    description: 'Additional notes about the support session',
    example: 'Focus on present perfect tense',
    required: false
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
