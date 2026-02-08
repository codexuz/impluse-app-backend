import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsObject,
  IsArray,
  IsInt,
  IsBoolean,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export enum ReadingPartEnum {
  PART_1 = "PART_1",
  PART_2 = "PART_2",
  PART_3 = "PART_3",
}

export enum QuestionContentTypeEnum {
  COMPLETION = "completion",
  MULTIPLE_CHOICE = "multiple-choice",
  MULTI_SELECT = "multi-select",
  SELECTION = "selection",
  DRAGGABLE_SELECTION = "draggable-selection",
  MATCHING_INFORMATION = "matching-information",
}

export class ReadingPartMultipleChoiceOptionDto {
  @ApiProperty({ example: "A" })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ example: "Climate change and its effects" })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}

export class ReadingPartMultipleChoiceQuestionDto {
  @ApiProperty({ example: "What is the main topic of the passage?" })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @ApiProperty({ type: [ReadingPartMultipleChoiceOptionDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReadingPartMultipleChoiceOptionDto)
  @IsOptional()
  options?: ReadingPartMultipleChoiceOptionDto[];
}

export class ReadingPartQuestionOptionDto {
  @ApiProperty({ example: "A" })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ example: "The Amazon rainforest" })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}

export class ReadingPartQuestionContentDto {
  @ApiProperty({
    enum: QuestionContentTypeEnum,
    example: QuestionContentTypeEnum.MULTIPLE_CHOICE,
  })
  @IsEnum(QuestionContentTypeEnum)
  @IsNotEmpty()
  type: QuestionContentTypeEnum;

  @ApiProperty({ example: "Questions 1-5", required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: "Choose the correct letter, A, B, or C",
    required: false,
  })
  @IsString()
  @IsOptional()
  condition?: string;

  @ApiProperty({
    example: "The library is open from @@ to @@",
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ example: 2, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  showOptions?: boolean;

  @ApiProperty({ example: "Choose from the following:", required: false })
  @IsString()
  @IsOptional()
  optionsTitle?: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @ApiProperty({ type: [ReadingPartQuestionOptionDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReadingPartQuestionOptionDto)
  @IsOptional()
  options?: ReadingPartQuestionOptionDto[];

  @ApiProperty({
    type: [ReadingPartMultipleChoiceQuestionDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReadingPartMultipleChoiceQuestionDto)
  @IsOptional()
  multipleChoiceQuestions?: ReadingPartMultipleChoiceQuestionDto[];
}

export class ReadingPartQuestionDto {
  @ApiProperty({ example: 10, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  number_of_questions?: number;

  @ApiProperty({ type: [ReadingPartQuestionContentDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReadingPartQuestionContentDto)
  @IsOptional()
  contents?: ReadingPartQuestionContentDto[];
}

export class CreateReadingPartDto {
  @ApiProperty({
    description: "The reading ID this part belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  reading_id: string;

  @ApiProperty({
    description: "The part number",
    enum: ReadingPartEnum,
    example: ReadingPartEnum.PART_1,
  })
  @IsEnum(ReadingPartEnum)
  @IsNotEmpty()
  part: ReadingPartEnum;

  @ApiProperty({
    description: "The reading part title",
    example: "The History of Astronomy",
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: "The reading passage text",
    example: "The passage text goes here...",
    required: false,
  })
  @IsString()
  @IsOptional()
  passage?: string;

  @ApiProperty({
    description: "Answer keys for the questions",
    example: { "1": "A", "2": "C", "3": "B" },
    required: false,
  })
  @IsObject()
  @IsOptional()
  answers?: Record<string, any>;

  @ApiProperty({
    description: "Questions for this reading part",
    type: [ReadingPartQuestionDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReadingPartQuestionDto)
  @IsOptional()
  questions?: ReadingPartQuestionDto[];
}
