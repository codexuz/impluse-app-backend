import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsInt,
  IsNumber,
  Min,
  IsArray,
  IsBoolean,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { QuestionType } from "../entities/ielts-quiz-question.entity.js";

export class CreateQuestionChoiceDto {
  @ApiProperty({ description: "Choice text", example: "True" })
  @IsString()
  @IsNotEmpty()
  choice_text: string;

  @ApiProperty({ description: "Is this the correct choice", example: false })
  @IsBoolean()
  @IsOptional()
  is_correct?: boolean;

  @ApiProperty({ description: "Choice position", example: 1 })
  @IsInt()
  @Min(1)
  position: number;
}

export class CreateAcceptedAnswerDto {
  @ApiProperty({
    description: "Accepted answer text",
    example: "photosynthesis",
  })
  @IsString()
  @IsNotEmpty()
  answer_text: string;
}

export class CreateQuizQuestionDto {
  @ApiProperty({ description: "Quiz ID" })
  @IsUUID()
  @IsNotEmpty()
  quiz_id: string;

  @ApiProperty({
    description: "Question type",
    enum: QuestionType,
    example: QuestionType.SINGLE_CHOICE,
  })
  @IsEnum(QuestionType)
  @IsNotEmpty()
  question_type: QuestionType;

  @ApiProperty({
    description: "Question prompt",
    example: "What is the main idea of paragraph 2?",
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({ description: "Explanation", required: false })
  @IsString()
  @IsOptional()
  explanation?: string;

  @ApiProperty({
    description: "Points for the question",
    example: 1.0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  points?: number;

  @ApiProperty({ description: "Question position", example: 1 })
  @IsInt()
  @Min(1)
  position: number;

  @ApiProperty({
    description: "Choices for the question",
    type: [CreateQuestionChoiceDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionChoiceDto)
  @IsOptional()
  choices?: CreateQuestionChoiceDto[];

  @ApiProperty({
    description: "Accepted answers for short_text questions",
    type: [CreateAcceptedAnswerDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAcceptedAnswerDto)
  @IsOptional()
  acceptedAnswers?: CreateAcceptedAnswerDto[];
}
