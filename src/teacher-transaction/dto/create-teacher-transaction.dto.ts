import { IsUUID, IsNotEmpty, IsInt, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TeacherTransactionType {
  KIRIM = 'kirim',
  OYLIK = 'oylik',
  BONUS = 'bonus',
  AVANS = 'avans',
  JARIMA = 'jarima'
}

export class CreateTeacherTransactionDto {
  @ApiProperty({
    description: 'Teacher ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  teacher_id: string;

  @ApiProperty({
    description: 'Transaction amount in cents or smallest currency unit',
    example: 5000,
  })
  @IsInt()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Type of transaction',
    enum: TeacherTransactionType,
    example: TeacherTransactionType.OYLIK,
  })
  @IsEnum(TeacherTransactionType)
  @IsNotEmpty()
  type: TeacherTransactionType;
}

