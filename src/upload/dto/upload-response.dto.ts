import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the upload',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'System generated filename',
    example: 'file_123456789.pdf'
  })
  filename: string;

  @ApiProperty({
    description: 'Original filename of the uploaded file',
    example: 'document.pdf'
  })
  original_name: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'application/pdf'
  })
  mime_type: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000
  })
  file_size: number;

  @ApiProperty({
    description: 'File path where the file is stored',
    example: '/uploads/2023/10/document.pdf'
  })
  file_path: string;

  @ApiPropertyOptional({
    description: 'User ID who uploaded the file',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  uploaded_by?: string;

  @ApiPropertyOptional({
    description: 'Type of upload',
    example: 'document'
  })
  upload_type?: string;

  @ApiPropertyOptional({
    description: 'Description of the uploaded file',
    example: 'Important document for review'
  })
  description?: string;

  @ApiProperty({
    description: 'Upload timestamp',
    example: '2023-10-26T10:30:00.000Z'
  })
  uploaded_at: Date;

  @ApiPropertyOptional({
    description: 'Deletion timestamp if file is soft deleted',
    example: null
  })
  deleted_at?: Date;
}

export class FileListItemDto {
  @ApiProperty({
    description: 'Filename',
    example: 'file_123456789.pdf'
  })
  filename: string;

  @ApiProperty({
    description: 'Full URL to access the file',
    example: 'https://api.example.com/uploads/file_123456789.pdf'
  })
  url: string;
}