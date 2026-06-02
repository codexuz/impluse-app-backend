import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  Matches,
  ValidateIf,
} from "class-validator";

export class CreateStaffPermissionDto {
  @ApiProperty({ description: "Staff (user) the permission is for" })
  @IsUUID()
  @IsNotEmpty()
  staff_id: string;

  @ApiProperty({
    description: "Permission type",
    enum: ["full_day", "late_arrival", "early_leave"],
  })
  @IsEnum(["full_day", "late_arrival", "early_leave"])
  type: "full_day" | "late_arrival" | "early_leave";

  @ApiProperty({ description: "First day (inclusive), YYYY-MM-DD", example: "2026-06-02" })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "start_date must be YYYY-MM-DD" })
  start_date: string;

  @ApiProperty({
    description: "Last day (inclusive), YYYY-MM-DD. Defaults to start_date if omitted",
    required: false,
    example: "2026-06-02",
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "end_date must be YYYY-MM-DD" })
  @IsOptional()
  end_date?: string;

  @ApiProperty({
    description: "HH:mm — required for late_arrival (excused arrival) and early_leave (excused checkout)",
    required: false,
    example: "10:30",
  })
  @ValidateIf((o) => o.type !== "full_day")
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: "permitted_time must be HH:mm" })
  permitted_time?: string;

  @ApiProperty({ description: "Reason for the request", required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}
