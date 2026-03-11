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
    description: 'Notification body content',
    example: 'We have added new features to the platform!'
  })
  @IsString()
  @IsNotEmpty()
  body: string;
  
  @ApiPropertyOptional({ 
    description: 'Additional data for the notification',
    example: { key: 'value' }
  })
  @IsOptional()
  data?: any;
}
