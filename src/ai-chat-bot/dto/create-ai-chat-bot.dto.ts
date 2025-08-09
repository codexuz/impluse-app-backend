import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAiChatBotDto {
  @ApiProperty({
    description: 'The message to send to the AI chatbot',
    example: 'Hello, how can you help me today?',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
  
  @ApiProperty({
    description: 'Whether to parse markdown to plain text',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  parseMarkdown?: boolean;
}
