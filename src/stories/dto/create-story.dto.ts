import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsUrl, IsInt } from 'class-validator';

export class CreateStoryDto {
  @ApiProperty({
    description: 'The title of the story',
    example: 'The Adventure Begins'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The URL to the story content',
    example: 'https://example.com/stories/adventure-begins'
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: 'Image URL for the story',
    example: 'https://example.com/images/adventure.jpg',
    required: false
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  image_url?: string;

  @ApiProperty({
    description: 'Whether the story is published or not',
    example: true,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
