import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID, IsOptional, IsString, Matches } from "class-validator";

export class CreateStaffProfileDto {
  @ApiProperty({ description: "Staff (user) ID" })
  @IsUUID()
  @IsNotEmpty()
  staff_id: string;

  @ApiProperty({
    description: "Expected check-in time (HH:MM or HH:MM:SS)",
    required: false,
    example: "09:00",
  })
  @IsString()
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: "in_time must be in HH:MM or HH:MM:SS format",
  })
  in_time?: string;

  @ApiProperty({
    description: "Expected check-out time (HH:MM or HH:MM:SS)",
    required: false,
    example: "18:00",
  })
  @IsString()
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: "out_time must be in HH:MM or HH:MM:SS format",
  })
  out_time?: string;
}
