import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateAvatarDto {
  @ApiProperty({
    description: "URL to the new avatar image",
    example: "https://backend.impulselc.uz/uploads/avatar-1234567890.jpg",
  })
  @IsString()
  @IsNotEmpty()
  avatar_url: string;
}
