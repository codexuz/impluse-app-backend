import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsInt,
  IsOptional,
  Min,
} from "class-validator";

export class CreateMultipleChoiceQuestionDto {
  @ApiProperty({
    description: "The question content ID this belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  question_content_id: string;

  @ApiProperty({
    description: "The question text",
    example: "What is the main topic of the passage?",
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    description: "Display order",
    example: 1,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}
