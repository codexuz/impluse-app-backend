import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsArray,
  IsDateString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateTaskDto {
  @ApiProperty({
    description: "Task title",
    example: "Describe your favorite food",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: "Task instructions",
    example: "Record a 2-minute video describing your favorite food in detail",
  })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiPropertyOptional({ description: "Task due date", example: "2025-12-31" })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({
    description: "Maximum video duration in seconds",
    example: 120,
  })
  @IsOptional()
  @IsInt()
  maxDurationSeconds?: number;

  @ApiPropertyOptional({
    description: "Task tags",
    example: ["speaking", "food", "vocabulary"],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
