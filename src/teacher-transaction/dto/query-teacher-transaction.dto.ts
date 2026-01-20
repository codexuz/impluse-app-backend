import { IsOptional, IsString, IsInt, Min, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class QueryTeacherTransactionDto {
  @ApiPropertyOptional({ description: "Page number", minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Number of items per page",
    minimum: 1,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: "Transaction type",
    enum: ["kirim", "oylik", "avans", "bonus"],
  })
  @IsOptional()
  @IsEnum(["kirim", "oylik", "avans", "bonus"])
  type?: string;

  @ApiPropertyOptional({ description: "Teacher ID (UUID)" })
  @IsOptional()
  @IsString()
  teacher_id?: string;

  @ApiPropertyOptional({ description: "Student ID (UUID)" })
  @IsOptional()
  @IsString()
  student_id?: string;

  @ApiPropertyOptional({ description: "Branch ID (UUID)" })
  @IsOptional()
  @IsString()
  branch_id?: string;

  @ApiPropertyOptional({
    description: "Search query (searches in student and teacher names)",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "Start date for filtering (ISO 8601 format)",
  })
  @IsOptional()
  @IsString()
  start_date?: string;

  @ApiPropertyOptional({
    description: "End date for filtering (ISO 8601 format)",
  })
  @IsOptional()
  @IsString()
  end_date?: string;
}
