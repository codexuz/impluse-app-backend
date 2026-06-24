import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsDateString,
  Matches,
} from "class-validator";
import { DaysEnum } from "../../groups/entities/group.entity.js";

export class CreateSupportAssignmentDto {
  @ApiProperty({
    description: "Support teacher ID (User with role support_teacher)",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  support_teacher_id: string;

  @ApiPropertyOptional({
    description: "Main (group) teacher ID this support covers",
    example: "123e4567-e89b-12d3-a456-426614174002",
  })
  @IsUUID()
  @IsOptional()
  teacher_id?: string;

  @ApiProperty({
    description: "Group ID the support teacher is assigned to",
    example: "123e4567-e89b-12d3-a456-426614174001",
  })
  @IsUUID()
  @IsNotEmpty()
  group_id: string;

  @ApiPropertyOptional({
    description: "Recurring days pattern",
    enum: DaysEnum,
    example: DaysEnum.ODD,
  })
  @IsEnum(DaysEnum)
  @IsOptional()
  days?: DaysEnum;

  @ApiPropertyOptional({
    description: "Session start time (HH:MM)",
    example: "14:00",
  })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: "start_time must be in HH:MM format",
  })
  @IsOptional()
  start_time?: string;

  @ApiPropertyOptional({
    description: "Session end time (HH:MM)",
    example: "15:30",
  })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: "end_time must be in HH:MM format",
  })
  @IsOptional()
  end_time?: string;

  @ApiPropertyOptional({
    description: "Date the assignment becomes active (YYYY-MM-DD)",
    example: "2026-07-01",
  })
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiPropertyOptional({
    description: "Date the assignment ends (YYYY-MM-DD)",
    example: "2026-09-01",
  })
  @IsDateString()
  @IsOptional()
  end_date?: string;

  @ApiPropertyOptional({
    description: "Whether the assignment is active",
    default: true,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({
    description: "Additional notes about the assignment",
    example: "Extra grammar support twice a week",
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
