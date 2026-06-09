import { IsEnum, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PurchaseStatus } from "../entities/shop-purchase.entity.js";

export class ReviewPurchaseDto {
  @ApiProperty({
    description: "New status for the purchase request",
    enum: [
      PurchaseStatus.APPROVED,
      PurchaseStatus.REJECTED,
      PurchaseStatus.DELIVERED,
    ],
    example: PurchaseStatus.APPROVED,
  })
  @IsEnum(PurchaseStatus)
  status: PurchaseStatus;

  @ApiPropertyOptional({
    description: "Optional admin note (e.g. rejection reason or delivery info)",
  })
  @IsString()
  @IsOptional()
  admin_note?: string;
}
