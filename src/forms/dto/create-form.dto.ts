import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

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
}
