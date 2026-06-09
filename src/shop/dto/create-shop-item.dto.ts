import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateShopItemDto {
  @ApiProperty({ description: "Name of the shop item", example: "T-Shirt" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: "Item description" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: "Image URL of the item" })
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiProperty({ description: "Price in coins", example: 500, minimum: 1 })
  @IsNumber()
  @Min(1)
  price: number;

  @ApiPropertyOptional({
    description: "Available stock. Omit for unlimited.",
    example: 10,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({
    description: "Whether the item is visible and purchasable",
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
