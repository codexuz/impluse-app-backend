import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTemplateDto {
  @ApiProperty({
    description: 'SMS template text',
    example: 'Your verification code is: {code}. Please do not share this code.',
  })
  @IsString()
  @IsNotEmpty()
  template: string;
}
