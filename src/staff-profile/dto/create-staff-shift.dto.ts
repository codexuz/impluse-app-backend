import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
} from "class-validator";

const DAY_VALUES = [
  "monday", "tuesday", "wednesday", "thursday",
  "friday", "saturday", "sunday", "every_day", "odd", "even",
] as const;

export class CreateStaffShiftDto {
  @ApiProperty({
    description: "Day(s) this shift applies to",
    enum: DAY_VALUES,
    default: "every_day",
  })
  @IsEnum(DAY_VALUES)
  @IsOptional()
  day_of_week?: typeof DAY_VALUES[number] = "every_day";

  @ApiProperty({ description: "Expected check-in time (HH:MM or HH:MM:SS)", example: "09:00" })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: "in_time must be HH:MM or HH:MM:SS",
  })
  in_time: string;

  @ApiProperty({
    description: "Expected check-out time (HH:MM or HH:MM:SS)",
    required: false,
    example: "18:00",
  })
  @IsString()
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: "out_time must be HH:MM or HH:MM:SS",
  })
  out_time?: string;

  @ApiProperty({
    description: "Grace period in minutes before lateness is counted",
    required: false,
    default: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  grace_period_minutes?: number = 0;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;
}
