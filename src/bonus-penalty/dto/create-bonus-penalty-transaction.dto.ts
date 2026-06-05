import {
  IsUUID,
  IsNotEmpty,
  IsInt,
  IsEnum,
  IsString,
  IsOptional,
  Min,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum BonusPenaltyType {
  BONUS = "bonus",
  JARIMA = "jarima",
  REFERAL = "referal",
}

export class CreateBonusPenaltyTransactionDto {
  @ApiProperty({
    description: "Teacher ID (UUID) who receives the bonus/referral or is fined",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  teacher_id: string;

  @ApiProperty({
    description: "Transaction amount (always a positive value)",
    example: 50000,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: "Type of transaction",
    enum: BonusPenaltyType,
    example: BonusPenaltyType.BONUS,
  })
  @IsEnum(BonusPenaltyType)
  @IsNotEmpty()
  type: BonusPenaltyType;

  @ApiProperty({
    description: "Referring student ID (UUID) — used for referal transactions",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  student_id?: string;

  @ApiProperty({
    description: "Referred lead ID (UUID) — used for referal transactions",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  lead_id?: string;

  @ApiProperty({
    description: "Branch ID (UUID)",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  branch_id?: string;

  @ApiProperty({
    description: "Bonus & penalty category ID (UUID)",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  category_id?: string;

  @ApiProperty({
    description: "Description of the transaction",
    example: "Bonus for good performance",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
