import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from "class-validator";

export class ScanStaffAttendanceDto {
  @ApiProperty({ description: "Group ID obtained from the QR code" })
  @IsUUID()
  @IsNotEmpty()
  group_id: string;

  @ApiProperty({ description: "Attendance type (in or out)", enum: ["in", "out"], default: "in" })
  @IsEnum(["in", "out"])
  @IsOptional()
  type?: "in" | "out" = "in";

  @ApiProperty({ description: "Description", required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: "Device GPS latitude (required when geofencing is enabled)", required: false })
  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsOptional()
  latitude?: number;

  @ApiProperty({ description: "Device GPS longitude (required when geofencing is enabled)", required: false })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  longitude?: number;
}
