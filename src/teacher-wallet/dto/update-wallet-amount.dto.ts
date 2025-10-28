import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWalletAmountDto {
  @ApiProperty({
    description: 'Amount to add or deduct from wallet (use negative for deduction)',
    example: 5000,
  })
  @IsInt()
  @IsNotEmpty()
  amount: number;
}
