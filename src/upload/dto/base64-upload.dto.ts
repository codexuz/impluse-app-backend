import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class Base64UploadDto {
  @ApiProperty({ 
    description: 'Base64 encoded file content',
    example: '9j/4AAQSkZJRgABAQEASABIAAD/...' 
  })
  @IsString()
  @IsNotEmpty()
  base64Data: string;

  @ApiProperty({
    description: 'Filename to use for the saved file (optional)',
    example: 'my-image.jpg',
    required: false
  })
  @IsString()
  filename?: string;
}
