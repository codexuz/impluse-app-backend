import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RequestFormOtpDto {
  @ApiProperty({
    description: 'ID of the form the response is being submitted to',
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  form_id: string;

  @ApiProperty({
    description: 'Phone number to send the SMS verification code to',
    example: '+998901234567',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;
}
