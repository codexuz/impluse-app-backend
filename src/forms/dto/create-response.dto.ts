import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject, IsOptional } from 'class-validator';

export class CreateResponseDto {
  @ApiProperty({
    description: 'ID of the form being responded to',
    example: "UUID or numeric ID"
  })
  @IsNotEmpty()
  @IsString()
  form_id: string;

  @ApiProperty({
    description: 'The user\'s answers to the form',
    example: {
      name: 'John Doe',
      email: 'john@example.com',
      feedback: 'Great service!'
    }
  })
  @IsNotEmpty()
  @IsObject()
  answers: any;

  @ApiProperty({
    description: 'Phone number that received the SMS code (required when the form has smsVerification enabled)',
    example: '+998901234567',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'SMS verification code (required when the form has smsVerification enabled)',
    example: '123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;
}