import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsInt,
  IsBoolean,
  Min,
} from "class-validator";

export enum QuestionContentTypeEnum {
  COMPLETION = "completion",
  MULTIPLE_CHOICE = "multiple-choice",
  MULTI_SELECT = "multi-select",
  SELECTION = "selection",
  DRAGGABLE_SELECTION = "draggable-selection",
  MATCHING = "matching",
}

export class CreateQuestionContentDto {
  @ApiProperty({
    description: "The question ID this content belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  question_id: string;

  @ApiProperty({
    description: "The type of question",
    enum: QuestionContentTypeEnum,
    example: QuestionContentTypeEnum.MULTIPLE_CHOICE,
  })
  @IsEnum(QuestionContentTypeEnum)
  @IsNotEmpty()
  type: QuestionContentTypeEnum;

  @ApiProperty({
    description: "Title for the question section",
    example: "Questions 1-5",
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: "Instructions/conditions for the question",
    example: "Choose the correct letter, A, B, or C",
    required: false,
  })
  @IsString()
  @IsOptional()
  condition?: string;

  @ApiProperty({
    description: "Content with placeholders (for completion type)",
    example: "The library is open from @@ to @@",
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: "Limit for multi-select questions",
    example: 2,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: "Whether to show options",
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  showOptions?: boolean;

  @ApiProperty({
    description: "Title for the options section",
    example: "Choose from the following:",
    required: false,
  })
  @IsString()
  @IsOptional()
  optionsTitle?: string;

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
