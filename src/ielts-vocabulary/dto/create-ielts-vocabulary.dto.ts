import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateIeltsVocabularyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
