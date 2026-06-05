import { IsString, IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BonusPenaltyType } from "./create-bonus-penalty-transaction.dto.js";

export class CreateBonusPenaltyCategoryDto {
  @ApiProperty({
    description: "Bonus & penalty category name",
    example: "Darsga kechikish",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description:
      "Optional scope — which transaction type this category applies to. Omit for any type.",
    enum: BonusPenaltyType,
    example: BonusPenaltyType.JARIMA,
    required: false,
  })
  @IsEnum(BonusPenaltyType)
  @IsOptional()
  type?: BonusPenaltyType;

  @ApiProperty({
    description: "Optional description of the category",
    example: "Darsga 15 daqiqadan ortiq kechikkanlik uchun jarima",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
