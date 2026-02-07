import { IsString, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateIeltsDeckWordDto {
  @IsUUID()
  @IsNotEmpty()
  deck_id: string;

  @IsString()
  @IsNotEmpty()
  word: string;

  @IsString()
  @IsOptional()
  partOfSpeech?: string;

  @IsString()
  @IsOptional()
  uzbek?: string;

  @IsString()
  @IsOptional()
  rus?: string;

  @IsString()
  @IsOptional()
  example?: string;

  @IsString()
  @IsOptional()
  definition?: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsString()
  @IsOptional()
  audio_url?: string;
}
