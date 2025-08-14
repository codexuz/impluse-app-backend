import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum } from 'class-validator';

export class CreateVocabularySetDto {
  @IsUUID()
  @IsOptional()
  course_id?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
  @IsOptional()
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

  @IsString()
  @IsOptional()
  topic?: string;
}
