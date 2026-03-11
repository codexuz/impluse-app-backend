import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsUUID, IsInt, Min, Max, IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateGradingDto {
  @ApiProperty({
    description: "ID of the student receiving the grade",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({
    description: "ID of the teacher assigning the grade",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  teacher_id: string;

  @ApiProperty({
    description: "ID of the group the student belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  group_id: string;

  @ApiProperty({
    description: "Grade assigned by the teacher (1-10)",
    example: 8,
    minimum: 1,
    maximum: 10,
  })
  @IsInt()
  @Min(1)
  @Max(10)
  grade: number;

  @ApiProperty({
    description: "Percentage score out of 100 (0-100)",
    example: 85,
    minimum: 0,
    maximum: 100,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  percent: number;

  @ApiPropertyOptional({
    description: "Name of the lesson for the grading",
    example: "Introduction to Biology",
  })
  @IsString()
  @IsOptional()
  lesson_name?: string;
}
