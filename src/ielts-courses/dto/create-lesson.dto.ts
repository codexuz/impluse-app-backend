import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
} from "class-validator";
import { LessonType } from "../entities/ielts-lesson.entity.js";

export class CreateLessonDto {
  @ApiProperty({ description: "Section ID" })
  @IsUUID()
  @IsNotEmpty()
  section_id: string;

  @ApiProperty({ description: "Lesson title", example: "Reading strategies" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: "Lesson position", example: 1 })
  @IsInt()
  @Min(1)
  position: number;

  @ApiProperty({
    description: "Lesson type",
    enum: LessonType,
    example: LessonType.VIDEO,
    required: false,
  })
  @IsEnum(LessonType)
  @IsOptional()
  lesson_type?: LessonType;

  @ApiProperty({ description: "Content URL for video/audio", required: false })
  @IsString()
  @IsOptional()
  content_url?: string;

  @ApiProperty({ description: "Content text for text lesson", required: false })
  @IsString()
  @IsOptional()
  content_text?: string;

  @ApiProperty({ description: "Duration in seconds", required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  duration_seconds?: number;
}
