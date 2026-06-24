import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsString,
  IsDateString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from "class-validator";
import { Type } from "class-transformer";
import { SupportAttendanceStatus } from "./create-support-attendance.dto.js";

export class BulkSupportAttendanceItemDto {
  @ApiProperty({
    description: "Student ID",
    example: "123e4567-e89b-12d3-a456-426614174003",
  })
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({
    description: "Attendance status",
    enum: SupportAttendanceStatus,
    example: SupportAttendanceStatus.PRESENT,
  })
  @IsEnum(SupportAttendanceStatus)
  @IsNotEmpty()
  status: SupportAttendanceStatus;

  @ApiPropertyOptional({ description: "Additional note" })
  @IsString()
  @IsOptional()
  note?: string;
}

export class BulkSupportAttendanceDto {
  @ApiPropertyOptional({
    description: "Support assignment ID this session belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsOptional()
  assignment_id?: string;

  @ApiProperty({
    description: "Support teacher ID",
    example: "123e4567-e89b-12d3-a456-426614174001",
  })
  @IsUUID()
  @IsNotEmpty()
  support_teacher_id: string;

  @ApiProperty({
    description: "Group ID",
    example: "123e4567-e89b-12d3-a456-426614174002",
  })
  @IsUUID()
  @IsNotEmpty()
  group_id: string;

  @ApiProperty({
    description: "Date of the support session (YYYY-MM-DD)",
    example: "2026-07-05",
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: "Per-student attendance records",
    type: [BulkSupportAttendanceItemDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BulkSupportAttendanceItemDto)
  records: BulkSupportAttendanceItemDto[];
}
