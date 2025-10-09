import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';

export class CreateResponseDto {
  @ApiProperty({
    description: 'ID of the form being responded to',
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  form_id: number;

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
}