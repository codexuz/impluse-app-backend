import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class TextToVoiceDto {
  @ApiProperty({
    description: 'The text to convert to voice',
    example: 'This text will be converted to speech',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Optional voice identifier to use',
    example: 'nova',
    required: false,
  })
  @IsString()
  @IsOptional()
  voice?: string;
}