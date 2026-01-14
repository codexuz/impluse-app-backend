import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsBoolean,
  IsEnum,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum CompensatedBy {
  SUPPORT_TEACHER = "support_teacher",
  MAIN_TEACHER = "main_teacher",
}

export class CreateCompensateLessonDto {
  @ApiProperty({
    description: "The ID of the teacher",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  @IsUUID()
  @IsNotEmpty()
  teacher_id: string;

  @ApiProperty({
    description: "The ID of the student",
    example: "987fcdeb-51a2-43d1-9b23-456789012345",
    format: "uuid",
  })
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({
    description: "The ID of the attendance record",
    example: "abc12345-def6-789g-hij0-123456789012",
    format: "uuid",
  })
  @IsUUID()
  @IsNotEmpty()
  attendance_id: string;

  @ApiProperty({
    description: "Whether the lesson has been compensated",
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  compensated?: boolean;

  @ApiProperty({
    description: "Who compensated the lesson",
    example: "support_teacher",
    enum: CompensatedBy,
  })
  @IsEnum(CompensatedBy)
  @IsOptional()
  compensated_by: CompensatedBy;

  @ApiProperty({
    description: "Valid until date (YYYY-MM-DD format)",
    example: "2026-02-15",
    format: "date",
  })
  @IsString()
  @IsNotEmpty()
  valid_until: string;
}
