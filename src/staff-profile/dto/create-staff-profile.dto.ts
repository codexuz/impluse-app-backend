import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateStaffProfileDto {
  @ApiProperty({ description: "Staff (user) ID" })
  @IsUUID()
  @IsNotEmpty()
  staff_id: string;
}
