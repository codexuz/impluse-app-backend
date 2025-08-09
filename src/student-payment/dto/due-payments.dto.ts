import { ApiProperty } from '@nestjs/swagger';

export class DuePaymentItemDto {
  @ApiProperty({
    description: 'Payment ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  id: string;

  @ApiProperty({
    description: 'Student ID',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  student_id: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 250.00
  })
  amount: number;

  @ApiProperty({
    description: 'Original payment date',
    example: '2025-06-29'
  })
  payment_date: Date;

  @ApiProperty({
    description: 'Next payment date that has passed',
    example: '2025-07-29'
  })
  next_payment_date: Date;

  @ApiProperty({
    description: 'Payment method',
    example: 'Naqd',
    enum: ['Naqd', 'Karta', 'Click', 'Payme']
  })
  payment_method: string;

  @ApiProperty({
    description: 'Whether a new payment record would be created',
    example: true
  })
  would_create_new_payment: boolean;

  @ApiProperty({
    description: 'New payment date that will be set for the new record',
    example: '2025-07-29'
  })
  new_payment_date: Date;

  @ApiProperty({
    description: 'New next payment date that will be set for the new record',
    example: '2025-08-29'
  })
  new_next_payment_date: Date;
}

export class DuePaymentsResponseDto {
  @ApiProperty({
    description: 'Number of payments with passed next_payment_date',
    example: 3
  })
  count: number;

  @ApiProperty({
    description: 'List of payments that would be processed',
    type: [DuePaymentItemDto]
  })
  payments: DuePaymentItemDto[];
}
