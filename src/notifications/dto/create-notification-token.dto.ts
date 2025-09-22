import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsUUID, IsOptional } from "class-validator";

export class CreateNotificationTokenDto {
  @ApiProperty({
    description: "Notification token string",
    example: "fcm_token_1234567890",
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiPropertyOptional({
    description: "User ID associated with the notification token",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID(4)
  @IsOptional()
  user_id?: string;
}
