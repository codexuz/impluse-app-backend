import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from './create-support-booking.dto.js';

export class SupportBookingResponseDto {
  @ApiProperty({
    description: 'Support booking ID',
    example: '123e4567-e89b-12d3-a456-426614174003'
  })
  id: string;

  @ApiProperty({
    description: 'Support teacher ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  support_teacher_id: string;

  @ApiProperty({
    description: 'Student ID who booked the support session',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  student_id: string;

  @ApiProperty({
    description: 'Schedule ID for the support session',
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  schedule_id: string;

  @ApiProperty({
    description: 'Booking date',
    example: '2024-01-25T00:00:00Z'
  })
  booking_date: Date;

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
    description: 'Booking status',
    enum: BookingStatus,
    example: BookingStatus.PENDING
  })
  status: BookingStatus;

  @ApiProperty({
    description: 'Additional notes for the booking',
    example: 'Need help with grammar exercises',
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
