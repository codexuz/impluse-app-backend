import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsInt,
  IsBoolean,
  Min,
} from "class-validator";

export class CreateQuizDto {
  @ApiProperty({ description: "Course ID" })
  @IsUUID()
  @IsNotEmpty()
  course_id: string;

  @ApiProperty({ description: "Section ID", required: false })
  @IsUUID()
  @IsOptional()
  section_id?: string;

  @ApiProperty({ description: "Lesson ID", required: false })
  @IsUUID()
  @IsOptional()
  lesson_id?: string;

  @ApiProperty({ description: "Quiz title", example: "Reading Quiz 1" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Time limit in seconds",
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  time_limit_seconds?: number;

  @ApiProperty({
    description: "Number of attempts allowed (0 = unlimited)",
    example: 0,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  attempts_allowed?: number;

  @ApiProperty({
    description: "Is the quiz published",
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_published?: boolean;
}
