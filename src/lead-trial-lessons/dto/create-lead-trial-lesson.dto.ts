import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsEnum, IsDateString } from 'class-validator';

export enum TrialLessonStatus {
  BELGILANGAN = 'belgilangan',
  KELDI = 'keldi',
  KELMADI = 'kelmadi'
}

export class CreateLeadTrialLessonDto {
  @ApiProperty({
    description: 'Scheduled date and time for the trial lesson',
    example: '2024-01-20T14:00:00Z'
  })
  @IsDateString()
  @IsNotEmpty()
  scheduledAt: Date;

  @ApiProperty({
    description: 'Trial lesson status',
    enum: TrialLessonStatus,
    example: TrialLessonStatus.BELGILANGAN
  })
  @IsEnum(TrialLessonStatus)
  status: TrialLessonStatus;

  @ApiProperty({
    description: 'Teacher ID assigned to the trial lesson',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  teacher_id: string;

  @ApiProperty({
    description: 'Lead ID for the trial lesson',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID()
  @IsNotEmpty()
  lead_id: string;

  @ApiProperty({
    description: 'Additional notes about the trial lesson',
    example: 'Student is interested in business English'
  })
  @IsString()
  @IsNotEmpty()
  notes: string;
}
