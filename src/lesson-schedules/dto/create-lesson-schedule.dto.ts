import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsDateString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateLessonScheduleDto {
  @ApiProperty({
    description: "The ID of the group for this lesson schedule",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  @IsUUID()
  @IsNotEmpty()
  group_id: string;

  @ApiProperty({
    description: "The name of the lesson",
    example: "Introduction to English Grammar",
  })
  @IsString()
  @IsNotEmpty()
  lesson_name: string;

  @ApiProperty({
    description: "The date of the lesson (YYYY-MM-DD)",
    example: "2026-01-15",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date?: string;
}
