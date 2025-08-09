import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateGroupChatDto {
  @ApiProperty({
    description: 'Name of the group chat',
    example: 'Math Study Group',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Description of the group chat',
    example: 'A group for discussing math homework and study sessions',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Image URL for the group chat',
    example: 'https://example.com/group-image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiProperty({
    description: 'Link for the group chat',
    example: 'https://example.com/group-link',
    required: false,
  })
  @IsString()
  @IsOptional()
  link?: string;

  @ApiProperty({
    description: 'Whether the group chat is private',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean = false;
}
