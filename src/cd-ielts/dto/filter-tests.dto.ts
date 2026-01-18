import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsEnum, IsDateString } from "class-validator";

export class FilterTestsDto {
  @ApiProperty({
    description: "Filter by test status",
    example: "active",
    enum: ["active", "full", "inactive"],
    required: false,
  })
  @IsOptional()
  @IsEnum(["active", "full", "inactive"])
  status?: string;

  @ApiProperty({
    description: "Filter by location",
    example: "Tashkent",
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: "Filter by start date (YYYY-MM-DD)",
    example: "2026-01-01",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({
    description: "Filter by end date (YYYY-MM-DD)",
    example: "2026-12-31",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiProperty({
    description: "Search query for title or location",
    example: "IELTS",
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
