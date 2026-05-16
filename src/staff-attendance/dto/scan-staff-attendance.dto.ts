import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID, IsOptional, IsString, IsEnum } from "class-validator";

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
}
