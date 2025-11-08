import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({
    description: 'Mobile phone number',
    example: '998901234567',
  })
  @IsString()
  @IsNotEmpty()
  mobile_phone: string;

  @ApiProperty({
    description: 'Notification title',
    example: 'Important Notice',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Notification body/message',
    example: 'Your appointment has been confirmed for tomorrow at 10:00 AM.',
  })
  @IsString()
  @IsNotEmpty()
  body: string;
}
