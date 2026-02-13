import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsInt,
  IsOptional,
  IsNumber,
  Min,
} from "class-validator";

export class CreateSubQuestionDto {
  @ApiProperty({
    description: "The parent question ID this sub-question belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  question_id: string;

  @ApiProperty({
    description: "The sub-question number",
    example: 1,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  questionNumber?: number;

  @ApiProperty({
    description: "The sub-question text",
    example:
      "Georgia O'Keeffe's style was greatly influenced by the changing fashions in art.",
    required: false,
  })
  @IsString()
  @IsOptional()
  questionText?: string;

  @ApiProperty({
    description: "Points for this sub-question",
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  points?: number;

  @ApiProperty({
    description: "The correct answer for this sub-question",
    example: "teacher",
    required: false,
  })
  @IsString()
  @IsOptional()
  correctAnswer?: string;

  @ApiProperty({
    description: "Explanation of the answer",
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
