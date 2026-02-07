import { IsString, IsNotEmpty, IsUUID } from "class-validator";

export class CreateIeltsVocabularyDeckDto {
  @IsUUID()
  @IsNotEmpty()
  ielts_vocabulary_id: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}
