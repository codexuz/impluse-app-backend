import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNumber, IsString, Min, Max } from "class-validator";
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

  @ApiProperty({
    description: "Search by title",
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
}

export class TestQueryDto extends PaginationDto {
  @ApiProperty({
    description: "Filter by mode",
    enum: ["practice", "mock"],
    required: false,
  })
  @IsString()
  @IsOptional()
  mode?: string;

  @ApiProperty({
    description: "Filter by status",
    enum: ["draft", "published"],
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;
}

export class ReadingQueryDto extends PaginationDto {
  @ApiProperty({
    description: "Filter by test ID",
    required: false,
  })
  @IsString()
  @IsOptional()
  testId?: string;

  @ApiProperty({
    description: "Filter by test mode",
    enum: ["practice", "mock"],
    required: false,
  })
  @IsString()
  @IsOptional()
  mode?: string;
}

export class ListeningQueryDto extends PaginationDto {
  @ApiProperty({
    description: "Filter by test ID",
    required: false,
  })
  @IsString()
  @IsOptional()
  testId?: string;

  @ApiProperty({
    description: "Filter by active status",
    required: false,
  })
  @Transform(({ value }) => value === "true" || value === true)
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: "Filter by test mode",
    enum: ["practice", "mock"],
    required: false,
  })
  @IsString()
  @IsOptional()
  mode?: string;
}

export class WritingQueryDto extends PaginationDto {
  @ApiProperty({
    description: "Filter by test ID",
    required: false,
  })
  @IsString()
  @IsOptional()
  testId?: string;

  @ApiProperty({
    description: "Filter by active status",
    required: false,
  })
  @Transform(({ value }) => value === "true" || value === true)
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: "Filter by test mode",
    enum: ["practice", "mock"],
    required: false,
  })
  @IsString()
  @IsOptional()
  mode?: string;
}
