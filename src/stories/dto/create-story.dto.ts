import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsUrl, IsEnum } from 'class-validator';

export class CreateStoryDto {
  @ApiProperty({
    description: 'The title of the story',
    example: 'The Adventure Begins'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The open URL for the story',
    example: 'https://example.com/open/adventure-begins'
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  open_url?: string;

  @ApiProperty({
    description: 'The main URL to the story content',
    example: 'https://example.com/stories/adventure-begins'
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: 'The type of story content',
    example: 'video',
    enum: ['video', 'image']
  })
  @IsEnum(['video', 'image'])
  @IsNotEmpty()
  type: 'video' | 'image';

  @ApiProperty({
    description: 'Whether the story is published or not',
    example: true,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
