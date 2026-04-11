import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class LookupWordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  word: string;
}
