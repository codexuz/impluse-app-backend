import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEnum, IsOptional } from "class-validator";
import { CourseStatus } from "../entities/ielts-course.entity.js";

export class CreateIeltsCourseDto {
  @ApiProperty({ description: "Course title", example: "IELTS Academic 9.0" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Course description",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Course status",
    enum: CourseStatus,
    example: CourseStatus.DRAFT,
    required: false,
  })
  @IsEnum(CourseStatus)
  @IsOptional()
  status?: CourseStatus;
}
