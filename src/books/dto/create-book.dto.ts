import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  url?: string;

  @IsString()
  @IsNotEmpty()
  level: string;
}
