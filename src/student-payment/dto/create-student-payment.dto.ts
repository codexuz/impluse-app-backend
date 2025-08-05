import { IsUUID, IsNumber, IsEnum, IsDate, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum PaymentMethod {
  CASH = 'Naqd',
  CARD = 'Karta',
  CLICK = 'Click',
  PAYME = 'Payme'
}

export class CreateStudentPaymentDto {
  @ApiProperty({
    description: 'The ID of the student',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({
    description: 'The ID of the manager',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @IsUUID()
  @IsNotEmpty()
  manager_id: string;

  @ApiProperty({
    description: 'The amount of the payment',
    example: 100.5
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
    description: 'Payment status'
  })
  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  status: PaymentStatus;

  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.CASH,
    description: 'Method of payment'
  })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  payment_method: PaymentMethod;

  @ApiProperty({
    example: new Date(),
    description: 'Date when payment was made'
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  payment_date: Date;

  @ApiProperty({
    example: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    description: 'Due date for next payment'
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  next_payment_date: Date;
}