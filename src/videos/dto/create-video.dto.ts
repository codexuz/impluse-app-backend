import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({ description: 'Video URL' })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({ description: 'Video source', required: false })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiProperty({ description: 'Video source', required: false })
  @IsOptional()
  @IsString()
  level?: string;

}