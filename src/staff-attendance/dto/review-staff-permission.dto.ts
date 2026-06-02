import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum, IsOptional } from "class-validator";

export class ReviewStaffPermissionDto {
  @ApiProperty({ description: "Decision", enum: ["approved", "rejected"] })
  @IsEnum(["approved", "rejected"])
  status: "approved" | "rejected";

  @ApiProperty({ description: "Optional note explaining the decision", required: false })
  @IsString()
  @IsOptional()
  review_note?: string;
}
