import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiPropertyOptional({
    description: 'Notification title',
    example: 'New Feature Alert'
  })
  title: string;

  @ApiProperty({
    description: 'Notification body content',
    example: 'We have added new features to the platform!'
  })
  body: string;

  @ApiPropertyOptional({
    description: 'Additional data for the notification',
    example: { key: 'value' }
  })
  data: any;

  @ApiProperty({
    description: 'Date when the notification was created',
    example: '2023-01-01T00:00:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the notification was last updated',
    example: '2023-01-01T00:00:00.000Z'
  })
  updatedAt: Date;
}
