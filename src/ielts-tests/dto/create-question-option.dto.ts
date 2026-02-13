import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsInt,
  IsOptional,
  IsBoolean,
  Min,
} from "class-validator";

export class CreateQuestionOptionDto {
  @ApiProperty({
    description: "The question ID this option belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  question_id: string;

  @ApiProperty({
    description: "The option key (e.g. A, B, C)",
    example: "A",
    required: false,
  })
  @IsString()
  @IsOptional()
  optionKey?: string;

  @ApiProperty({
    description: "The option text",
    example: "Susanna Tol",
    required: false,
  })
  @IsString()
  @IsOptional()
  optionText?: string;

  @ApiProperty({
    description: "Whether this option is the correct answer",
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isCorrect?: boolean;

  @ApiProperty({
    description: "Display order index",
    example: 0,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  orderIndex?: number;

  @ApiProperty({
    description: "Explanation for this option",
    required: false,
  })
  @IsString()
  @IsOptional()
  explanation?: string;

  @ApiProperty({
    description: "Reference to the passage section",
    required: false,
  })
  @IsString()
  @IsOptional()
  fromPassage?: string;
}
