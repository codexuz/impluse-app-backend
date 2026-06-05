import { IsUUID, IsNotEmpty, IsInt, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateBonusPenaltyWalletDto {
  @ApiProperty({
    description: "Teacher ID (UUID)",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  teacher_id: string;

  @ApiProperty({
    description: "Initial wallet balance",
    example: 0,
    required: false,
  })
  @IsInt()
  @IsOptional()
  amount?: number;
}
