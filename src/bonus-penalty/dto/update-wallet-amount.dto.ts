import { IsInt, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateWalletAmountDto {
  @ApiProperty({
    description:
      "Amount to add or deduct from the wallet (use negative for deduction)",
    example: 50000,
  })
  @IsInt()
  @IsNotEmpty()
  amount: number;
}
