import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePronunciationExerciseDto {
  @ApiProperty({
    description: 'The ID of the speaking exercise this pronunciation exercise belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  speaking_id: string;

  @ApiProperty({
    description: 'The word or phrase that needs to be pronounced',
    example: 'pronunciation'
  })
  @IsString()
  @IsNotEmpty()
  word_to_pronunce: string;

  @ApiProperty({
    description: 'The URL of the audio file containing the correct pronunciation',
    example: 'https://storage.example.com/audio/pronunciation.mp3'
  })
  @IsString()
  @IsNotEmpty()
  audio_url: string;
}
