import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SendSmsDto {
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
