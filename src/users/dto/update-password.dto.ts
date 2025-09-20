import { IsString, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordDto {
  @ApiProperty({
    description: "Current password for verification",
    example: "currentPassword123",
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description: "New password",
    minLength: 6,
    example: "newPassword123",
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
