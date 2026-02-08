import { ApiProperty } from "@nestjs/swagger";
import {
  IsUUID,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Max,
} from "class-validator";
import { LessonProgressStatus } from "../entities/ielts-lesson-progress.entity.js";

export class CreateLessonProgressDto {
  @ApiProperty({ description: "User ID" })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ description: "Lesson ID" })
  @IsUUID()
  @IsNotEmpty()
  lesson_id: string;

  @ApiProperty({
    description: "Progress status",
    enum: LessonProgressStatus,
    required: false,
  })
  @IsEnum(LessonProgressStatus)
  @IsOptional()
  status?: LessonProgressStatus;

  @ApiProperty({
    description: "Progress percentage",
    example: 50,
    required: false,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress_percent?: number;
}
