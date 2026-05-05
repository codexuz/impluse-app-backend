import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendNotificationDto {
  @ApiProperty({
    description: "The ID of the student whose parents will receive the notification",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsString()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({
    description: "The message to be sent to parents via Telegram",
    example: "Your child's attendance record has been updated.",
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class SendNotificationResponseDto {
  @ApiProperty({
    description: "Whether the notification was sent successfully",
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: "Status message",
    example: "Notification sent",
  })
  message: string;
}

export class BroadcastMessageDto {
  @ApiProperty({
    description: "The message to be broadcasted to all linked parents via Telegram",
    example: "Important announcement: The center will be closed tomorrow.",
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class BroadcastResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: "Broadcast sent" })
  message: string;

  @ApiProperty({ example: 10 })
  successCount: number;

  @ApiProperty({ example: 0 })
  failureCount: number;
}
