import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsBoolean,
  Matches,
} from "class-validator";
import { DaysEnum } from "../entities/group.entity.js";

export class CreateGroupDto {
  @ApiProperty({
    description: "The name of the group",
    example: "Advanced English 101",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "UUID of the teacher assigned to the group",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  teacher_id?: string;

  @ApiProperty({
    description: "UUID of the level assigned to the group",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  level_id?: string;

  @ApiProperty({
    description: "Days pattern for the group lessons",
    example: "odd",
    enum: DaysEnum,
    required: false,
  })
  @IsEnum(DaysEnum)
  @IsOptional()
  days?: DaysEnum;

  @ApiProperty({
    description: "Lesson start time in HH:MM format",
    example: "09:00",
    required: false,
  })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message:
      "lesson_start must be in HH:MM or HH:MM:SS format (e.g., 09:00 or 09:00:00)",
  })
  @IsOptional()
  lesson_start?: string;

  @ApiProperty({
    description: "Lesson end time in HH:MM format",
    example: "10:30",
    required: false,
  })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message:
      "lesson_end must be in HH:MM or HH:MM:SS format (e.g., 10:30 or 10:30:00)",
  })
  @IsOptional()
  lesson_end?: string;

  @ApiProperty({
    description: "Whether the group is IELTS-specific",
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isIELTS?: boolean;

  @ApiProperty({
    description: "Whether the group is English-specific",
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isEnglish?: boolean;
}
