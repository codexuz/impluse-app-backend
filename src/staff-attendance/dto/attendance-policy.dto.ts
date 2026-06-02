import { ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsOptional,
  IsBoolean,
  IsString,
  IsUUID,
  Min,
  Matches,
} from "class-validator";

export class AttendancePolicyDto {
  @ApiProperty({ description: "Branch ID — null means global", required: false })
  @IsUUID()
  @IsOptional()
  branch_id?: string;

  @ApiProperty({ description: "Role name this policy targets — null means all roles", required: false, example: "teacher" })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiProperty({ description: "Minutes of tolerance before lateness is counted", required: false, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  grace_period_minutes?: number;

  @ApiProperty({ description: "Fine amount (coins) when late ≤ tier1 threshold", required: false, default: 100000 })
  @IsInt()
  @Min(0)
  @IsOptional()
  fine_tier1_amount?: number;

  @ApiProperty({ description: "Minutes-late boundary between tier1 and tier2", required: false, default: 10 })
  @IsInt()
  @Min(1)
  @IsOptional()
  fine_tier1_max_minutes?: number;

  @ApiProperty({ description: "Fine amount (coins) when late > tier1 threshold", required: false, default: 200000 })
  @IsInt()
  @Min(0)
  @IsOptional()
  fine_tier2_amount?: number;

  @ApiProperty({ description: "Daily fine cap (0 = no cap)", required: false, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  max_fine_per_day?: number;

  @ApiProperty({ description: "Policy effective from date (YYYY-MM-DD)", required: false })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "effective_from must be YYYY-MM-DD" })
  @IsOptional()
  effective_from?: string;

  @ApiProperty({ description: "Policy effective to date (YYYY-MM-DD)", required: false })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "effective_to must be YYYY-MM-DD" })
  @IsOptional()
  effective_to?: string;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
