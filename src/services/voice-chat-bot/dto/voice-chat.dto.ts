import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class VoiceChatDto {
  @ApiProperty({
    description: 'The text input to be processed',
    example: 'Tell me about the weather today',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Optional voice identifier to use for the response',
    example: 'alloy',
    required: false,
  })
  @IsString()
  @IsOptional()
  voice?: string;
}