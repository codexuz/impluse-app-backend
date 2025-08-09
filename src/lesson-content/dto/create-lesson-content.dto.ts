import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class CreateLessonContentDto {
  @ApiProperty({ example: 'Introduction to TypeScript' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Detailed content about TypeScript...', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ example: 'https://example.com/media/typescript.mp4', required: false })
  @IsString()
  @IsOptional()
  mediaUrl?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  order_number: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsUUID()
  @IsOptional()
  lessonId?: string;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}