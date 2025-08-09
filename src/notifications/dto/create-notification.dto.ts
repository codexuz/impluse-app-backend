// dto/create-notification.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @ApiPropertyOptional({ 
    description: 'Notification title',
    example: 'New Feature Alert'
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ 
    description: 'Notification message content',
    example: 'We have added new features to the platform!'
  })
  @IsString()
  @IsNotEmpty()
  message: string;
  
  @ApiPropertyOptional({ 
    description: 'URL to an image for the notification',
    example: 'https://example.com/images/notification-image.jpg'
  })
  @IsString()
  @IsOptional()
  img_url?: string;
}
