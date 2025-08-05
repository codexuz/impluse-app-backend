import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsDateString, IsOptional, IsEnum } from 'class-validator';

export enum BookingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  CANCELLED = 'cancelled'
}

export class CreateSupportBookingDto {
  @ApiProperty({
    description: 'Support teacher ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  support_teacher_id: string;

  @ApiProperty({
    description: 'Student ID who is booking the support session',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({
    description: 'Schedule ID for the support session',
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  @IsUUID()
  @IsNotEmpty()
  schedule_id: string;

  @ApiProperty({
    description: 'Booking date',
    example: '2024-01-25T00:00:00Z'
  })
  @IsDateString()
  @IsNotEmpty()
  booking_date: Date;

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
    description: 'Booking status',
    enum: BookingStatus,
    example: BookingStatus.PENDING,
    default: BookingStatus.PENDING
  })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiProperty({
    description: 'Additional notes for the booking',
    example: 'Need help with grammar exercises',
    required: false
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
