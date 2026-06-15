import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class RetentionQueryDto {
  @ApiPropertyOptional({
    description:
      "Number of trailing months to include (ending with the current month). Defaults to 6.",
    example: 6,
    minimum: 1,
    maximum: 24,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(24)
  months?: number;

  @ApiPropertyOptional({
    description:
      "Anchor year for the trailing window (the last month included). Defaults to the current year.",
    example: 2026,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  year?: number;

  @ApiPropertyOptional({
    description:
      "Anchor month 1-12 for the trailing window (the last month included). Defaults to the current month.",
    example: 6,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;
}
