import { IsUUID, IsNotEmpty, IsInt, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TransactionType {
  LESSON_WITHDRAWAL = 'lesson_withdrawal',
  PAYMENT = 'payment',
  REFUND = 'refund',
}

export class CreateStudentTransactionDto {
  @ApiProperty({
    description: 'Student ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({
    description: 'Transaction amount in cents or smallest currency unit',
    example: 5000,
  })
  @IsInt()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Type of transaction',
    enum: TransactionType,
    example: TransactionType.PAYMENT,
  })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;
}

