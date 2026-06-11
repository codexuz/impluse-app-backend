import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CreateTopicDto {
  @ApiProperty({ example: "Hometown" })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: "Talk about where you grew up." })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ["ielts", "general", "pronunciation"], default: "general" })
  @IsOptional()
  @IsEnum(["ielts", "general", "pronunciation"])
  category?: "ielts" | "general" | "pronunciation";

  @ApiPropertyOptional({ example: "B1" })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
