import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateFormDto {
  @ApiProperty({
    description: 'The title of the form',
    example: 'Student Feedback Form'
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The Vueform schema JSON',
    example: {
      fields: {
        name: { type: 'text', label: 'Full Name' },
        email: { type: 'email', label: 'Email Address' },
        feedback: { type: 'textarea', label: 'Your Feedback' }
      }
    }
  })
  @IsNotEmpty()
  @IsObject()
  schema: any;

  @ApiProperty({
    description: 'When true, a verified SMS code is required to submit a response',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  smsVerification?: boolean;
}
