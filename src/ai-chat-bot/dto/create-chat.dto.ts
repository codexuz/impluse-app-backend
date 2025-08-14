import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({
    description: 'The role of the message sender',
    enum: ['user', 'assistant'],
    example: 'user'
  })
  @IsEnum(['user', 'assistant'])
  @IsNotEmpty()
  role: string;

  @ApiProperty({
    description: 'The content of the chat message',
    example: 'Hello, how can you help me with my English studies?'
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
