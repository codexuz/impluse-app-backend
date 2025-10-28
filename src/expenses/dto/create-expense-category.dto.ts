import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseCategoryDto {
  @ApiProperty({
    description: 'Expense category name',
    example: 'Office Supplies',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
