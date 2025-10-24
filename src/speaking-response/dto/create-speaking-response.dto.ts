import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateSpeakingResponseDto {
  @ApiProperty({
    description: 'The speaking ID this response is associated with',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  speaking_id: string;
  
  @ApiProperty({
    description: 'The student ID this response belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  student_id: string;

  @ApiProperty({
    description: 'Type of speaking response',
    enum: ['part1', 'part2', 'part3', 'pronunciation'],
    example: 'part1'
  })
  @IsEnum(['part1', 'part2', 'part3', 'pronunciation'])
  response_type: 'part1' | 'part2' | 'part3' | 'pronunciation';

  @ApiProperty({
    description: 'URLs to the audio recordings',
    example: ['https://storage.example.com/audio/recording-123.mp3'],
    required: false,
    isArray: true,
    type: [String]
  })
  @IsString({ each: true })
  @IsOptional()
  audio_url?: string[];

  @ApiProperty({
    description: 'Transcription of the audio recording',
    example: 'In my opinion, the most important factor is...',
    required: false
  })
  @IsString()
  @IsOptional()
  transcription?: string;

  @ApiProperty({
    description: 'General assessment result data',
    required: false
  })
  @IsOptional()
  result?: any;

  @ApiProperty({
    description: 'Overall pronunciation score (0-100)',
    example: 85.5,
    required: false
  })
  @IsNumber()
  @IsOptional()
  pronunciation_score?: number;

  @ApiProperty({
    description: 'Feedback on errors and improvement suggestions',
    example: 'Work on your intonation for questions. Good vocabulary usage.',
    required: false
  })
  @IsString()
  @IsOptional()
  feedback?: string;
}
