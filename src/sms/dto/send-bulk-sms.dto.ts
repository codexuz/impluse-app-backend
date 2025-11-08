import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class BulkSmsMessageDto {
  @ApiProperty({
    description: 'Custom SMS ID (optional)',
    example: 'sms1',
    required: false,
  })
  @IsString()
  @IsOptional()
  user_sms_id?: string;

  @ApiProperty({
    description: 'Mobile phone number',
    example: '998901234567',
  })
  @IsString()
  @IsNotEmpty()
  mobile_phone: string;

  @ApiProperty({
    description: 'SMS message text',
    example: 'Hello from Eskiz SMS!',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class SendBulkSmsDto {
  @ApiProperty({
    description: 'Array of SMS messages to send',
    type: [BulkSmsMessageDto],
    example: [
      {
        user_sms_id: 'sms1',
        mobile_phone: '998901234567',
        message: 'Hello User 1',
      },
      {
        user_sms_id: 'sms2',
        mobile_phone: '998901234568',
        message: 'Hello User 2',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkSmsMessageDto)
  messages: BulkSmsMessageDto[];
}
