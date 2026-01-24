import { IsOptional, IsString, IsInt, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class QueryStudentParentDto {
  @ApiProperty({
    description: "Page number (starts from 1)",
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: "Number of items per page",
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: "Search by parent full name",
    example: "John Doe",
    required: false,
  })
  @IsOptional()
  @IsString()
  parent_name?: string;

  @ApiProperty({
    description: "Search by parent phone number",
    example: "+998901234567",
    required: false,
  })
  @IsOptional()
  @IsString()
  parent_phone?: string;

  @ApiProperty({
    description: "Search by student full name",
    example: "Jane Doe",
    required: false,
  })
  @IsOptional()
  @IsString()
  student_name?: string;
}
