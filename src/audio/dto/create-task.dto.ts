import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsArray,
  IsEnum,
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

  @ApiProperty({
    description: "Task difficulty level",
    example: "easy",
    enum: ["easy", "medium", "hard"],
  })
  @IsOptional()
  @IsEnum(["easy", "medium", "hard"])
  difficulty?: "easy" | "medium" | "hard";

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
