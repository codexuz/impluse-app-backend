import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateLessonVocabularySetDto {
  @ApiProperty({
    description: 'The ID of the lesson',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  lesson_id: string;

  @ApiProperty({
    description: 'The ID of the vocabulary item',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  vocabulary_item_id: string;
}
