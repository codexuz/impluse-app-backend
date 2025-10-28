import { IsString, IsNotEmpty, IsUUID, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Expense title',
    example: 'Office rent payment',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Expense category ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  category_id: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the expense',
    example: 'Monthly office rent for December 2025',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Expense amount in cents or smallest currency unit',
    example: 500000,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @ApiPropertyOptional({
    description: 'Teacher ID if expense is related to a teacher (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  teacher_id?: string;

  @ApiPropertyOptional({
    description: 'User ID who reported/created the expense (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  reported_by?: string;
}

