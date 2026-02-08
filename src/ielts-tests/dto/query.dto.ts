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

  @ApiProperty({
    description: "Filter by reading part",
    enum: ["PART_1", "PART_2", "PART_3"],
    required: false,
  })
  @IsString()
  @IsOptional()
  part?: string;
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

export class ReadingPartQueryDto extends PaginationDto {
  @ApiProperty({
    description: "Filter by reading ID",
    required: false,
  })
  @IsString()
  @IsOptional()
  readingId?: string;

  @ApiProperty({
    description: "Filter by part",
    enum: ["PART_1", "PART_2", "PART_3"],
    required: false,
  })
  @IsString()
  @IsOptional()
  part?: string;
}

export class ListeningPartQueryDto extends PaginationDto {
  @ApiProperty({
    description: "Filter by listening ID",
    required: false,
  })
  @IsString()
  @IsOptional()
  listeningId?: string;

  @ApiProperty({
    description: "Filter by part",
    enum: ["PART_1", "PART_2", "PART_3", "PART_4"],
    required: false,
  })
  @IsString()
  @IsOptional()
  part?: string;
}
