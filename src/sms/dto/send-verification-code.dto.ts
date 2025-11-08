import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SendVerificationCodeDto {
  @ApiProperty({
    description: 'Mobile phone number',
    example: '998901234567',
  })
  @IsString()
  @IsNotEmpty()
  mobile_phone: string;

  @ApiProperty({
    description: 'Verification code',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
