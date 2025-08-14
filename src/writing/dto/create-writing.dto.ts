import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateWritingDto {
  @IsUUID()
  @IsNotEmpty()
  lessonId: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  instruction: string;

  @IsString()
  @IsNotEmpty()
  sample_answer: string;
}
