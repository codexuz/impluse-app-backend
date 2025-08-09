import { ApiProperty } from '@nestjs/swagger';

export class MarkNotificationSeenResponseDto {
  @ApiProperty({
    description: 'Success status of the operation',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Notification marked as seen'
  })
  message: string;
}
