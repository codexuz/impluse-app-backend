import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNumber, Min, Max } from "class-validator";
import { Transform } from "class-transformer";

export class PaginationDto {
  @ApiProperty({
    description: "Page number",
    example: 1,
    default: 1,
    minimum: 1,
    required: false,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: "Number of items per page",
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
