import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsBoolean, IsEnum, IsInt } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({ description: 'Title of the lesson' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Order/sequence number of the lesson' })
  @IsInt()
  order: number;

  @ApiProperty({ description: 'Whether the lesson is active', default: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'Type of the lesson', enum: ['lesson', 'practice', 'test'], default: 'lesson', required: false })
  @IsEnum(['lesson', 'practice', 'test'])
  @IsOptional()
  type?: 'lesson' | 'practice' | 'test';

  @ApiProperty({ description: 'ID of the module this lesson belongs to', required: false })
  @IsUUID()
  @IsOptional()
  moduleId?: string;
}
