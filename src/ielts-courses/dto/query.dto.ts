import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsNumber,
  IsString,
  Min,
  Max,
  IsEnum,
  IsBoolean,
  IsUUID,
} from "class-validator";
import { Transform } from "class-transformer";

export class PaginationDto {
  @ApiProperty({
    description: "Page number",
    example: 1,
    default: 1,
    required: false,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: "Items per page",
    example: 10,
    default: 10,
    required: false,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({ description: "Search by title", required: false })
  @IsString()
  @IsOptional()
  search?: string;
}

export class CourseQueryDto extends PaginationDto {
  @ApiProperty({
    description: "Filter by status",
    enum: ["draft", "published", "archived"],
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;
}

export class SectionQueryDto extends PaginationDto {
  @ApiProperty({ description: "Filter by course ID", required: false })
  @IsString()
  @IsOptional()
  courseId?: string;
}

export class LessonQueryDto extends PaginationDto {
  @ApiProperty({ description: "Filter by section ID", required: false })
  @IsString()
  @IsOptional()
  sectionId?: string;
}

export class QuizQueryDto extends PaginationDto {
  @ApiProperty({ description: "Filter by course ID", required: false })
  @IsString()
  @IsOptional()
  courseId?: string;

  @ApiProperty({ description: "Filter by section ID", required: false })
  @IsString()
  @IsOptional()
  sectionId?: string;

  @ApiProperty({ description: "Filter by lesson ID", required: false })
  @IsString()
  @IsOptional()
  lessonId?: string;

  @ApiProperty({
    description: "Filter by published status",
    required: false,
  })
  @Transform(({ value }) => value === "true" || value === true)
  @IsOptional()
  isPublished?: boolean;
}

export class QuizQuestionQueryDto extends PaginationDto {
  @ApiProperty({ description: "Filter by quiz ID", required: false })
  @IsString()
  @IsOptional()
  quizId?: string;
}
