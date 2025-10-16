import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class SpeechToTextDto {
  @ApiProperty({
    description: 'Base64 encoded audio data (without data URI prefix)',
    example: 'UklGRiSAAABXQVZFZm10IBAAAAABAAEA...',
  })
  @IsString()
  base64Audio: string;

  @ApiProperty({
    description: 'Optional MIME type of the audio data',
    example: 'audio/mpeg',
    required: false,
  })
  @IsString()
  @IsOptional()
  mimeType?: string;
}