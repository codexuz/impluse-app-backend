import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject } from 'class-validator';

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
}