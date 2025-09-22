import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class NotificationTokenResponseDto {
  @ApiProperty({
    description: "Unique identifier",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiPropertyOptional({
    description: "User ID associated with the notification token",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  user_id: string;

  @ApiProperty({
    description: "Notification token string",
    example: "fcm_token_1234567890",
  })
  token: string;

  @ApiProperty({
    description: "Date when the notification token was created",
    example: "2023-01-01T00:00:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Date when the notification token was last updated",
    example: "2023-01-01T00:00:00.000Z",
  })
  updatedAt: Date;
}
