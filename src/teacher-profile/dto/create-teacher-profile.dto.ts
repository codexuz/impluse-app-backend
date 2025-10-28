import { IsUUID, IsNotEmpty, IsEnum, IsInt, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PaymentType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export class CreateTeacherProfileDto {
  @ApiProperty({
    description: 'User ID (UUID) of the teacher',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiPropertyOptional({
    description: 'Payment type for the teacher',
    enum: PaymentType,
    example: PaymentType.PERCENTAGE,
  })
  @IsEnum(PaymentType)
  @IsOptional()
  payment_type?: PaymentType;

  @ApiPropertyOptional({
    description: 'Payment value (percentage 0-100 or fixed amount)',
    example: 50,
  })
  @IsInt()
  @IsOptional()
  payment_value?: number;

  @ApiPropertyOptional({
    description: 'Day of the month for payment (1-31)',
    example: 15,
    minimum: 1,
    maximum: 31,
  })
  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  payment_day?: number;
}

