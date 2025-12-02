import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class GetUserTotalsDto {
  @ApiProperty({
    description: "Year for the totals report",
    example: 2025,
    minimum: 2020,
    maximum: 2050,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(2020)
  @Max(2050)
  @Type(() => Number)
  year: number;

  @ApiProperty({
    description: "Month for the totals report (1-12)",
    example: 12,
    minimum: 1,
    maximum: 12,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  month: number;
}
