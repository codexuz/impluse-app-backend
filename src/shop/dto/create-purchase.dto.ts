import { IsNotEmpty, IsUUID, IsNumber, IsOptional, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePurchaseDto {
  @ApiProperty({
    description: "The shop item to buy",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  item_id: string;

  @ApiPropertyOptional({ description: "Quantity to buy", example: 1, default: 1, minimum: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;
}
