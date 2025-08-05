import { IsString, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateVocabularyItemDto {
  @IsUUID()
  @IsNotEmpty()
  set_id: string;

  @IsString()
  @IsNotEmpty()
  word: string;

  @IsString()
  @IsOptional()
  uzbek?: string;

  @IsString()
  @IsOptional()
  rus?: string;

  @IsString()
  @IsOptional()
  audio_url?: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsString()
  @IsOptional()
  example?: string;
}
