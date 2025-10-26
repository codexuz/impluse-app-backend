import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';

export enum UploadType {
  AUDIO = 'audio',
  IMAGE = 'image',
  DOCUMENT = 'document',
  VIDEO = 'video',
  OTHER = 'other'
}

export class CreateUploadDto {
  @ApiProperty({
    description: 'Original filename of the uploaded file',
    example: 'document.pdf'
  })
  @IsString()
  @IsNotEmpty()
  original_name!: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'application/pdf'
  })
  @IsString()
  @IsNotEmpty()
  mime_type!: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000
  })
  @IsNumber()
  file_size!: number;

  @ApiProperty({
    description: 'File path where the file is stored',
    example: '/uploads/2023/10/document.pdf'
  })
  @IsString()
  @IsNotEmpty()
  file_path!: string;

  @ApiPropertyOptional({
    description: 'User ID who uploaded the file',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsOptional()
  uploaded_by?: string;

  @ApiPropertyOptional({
    description: 'Type of upload',
    enum: UploadType,
    example: UploadType.DOCUMENT
  })
  @IsEnum(UploadType)
  @IsOptional()
  upload_type?: UploadType;

  @ApiPropertyOptional({
    description: 'Description of the uploaded file',
    example: 'Important document for review'
  })
  @IsString()
  @IsOptional()
  description?: string;
}