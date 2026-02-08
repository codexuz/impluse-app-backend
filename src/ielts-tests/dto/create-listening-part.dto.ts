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

export enum ListeningPartEnum {
  PART_1 = "PART_1",
  PART_2 = "PART_2",
  PART_3 = "PART_3",
  PART_4 = "PART_4",
}

export enum QuestionContentTypeEnum {
  COMPLETION = "completion",
  MULTIPLE_CHOICE = "multiple-choice",
  MULTI_SELECT = "multi-select",
  SELECTION = "selection",
  DRAGGABLE_SELECTION = "draggable-selection",
  MATCHING_INFORMATION = "matching-information",
}

export class ListeningPartAudioDto {
  @ApiProperty({ example: "https://example.com/audio/part1.mp3" })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: "listening-part1.mp3", required: false })
  @IsString()
  @IsOptional()
  file_name?: string;

  @ApiProperty({ example: 180, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  duration?: number;
}

export class ListeningPartMultipleChoiceOptionDto {
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

export class ListeningPartMultipleChoiceQuestionDto {
  @ApiProperty({ example: "What is the main topic of the conversation?" })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @ApiProperty({
    type: [ListeningPartMultipleChoiceOptionDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListeningPartMultipleChoiceOptionDto)
  @IsOptional()
  options?: ListeningPartMultipleChoiceOptionDto[];
}

export class ListeningPartQuestionOptionDto {
  @ApiProperty({ example: "A" })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ example: "The library" })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}

export class ListeningPartQuestionContentDto {
  @ApiProperty({
    enum: QuestionContentTypeEnum,
    example: QuestionContentTypeEnum.COMPLETION,
  })
  @IsEnum(QuestionContentTypeEnum)
  @IsNotEmpty()
  type: QuestionContentTypeEnum;

  @ApiProperty({ example: "Questions 1-5", required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: "Complete the notes below", required: false })
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

  @ApiProperty({ type: [ListeningPartQuestionOptionDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListeningPartQuestionOptionDto)
  @IsOptional()
  options?: ListeningPartQuestionOptionDto[];

  @ApiProperty({
    type: [ListeningPartMultipleChoiceQuestionDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListeningPartMultipleChoiceQuestionDto)
  @IsOptional()
  multipleChoiceQuestions?: ListeningPartMultipleChoiceQuestionDto[];
}

export class ListeningPartQuestionDto {
  @ApiProperty({ example: 10, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  number_of_questions?: number;

  @ApiProperty({ type: [ListeningPartQuestionContentDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListeningPartQuestionContentDto)
  @IsOptional()
  contents?: ListeningPartQuestionContentDto[];
}

export class CreateListeningPartDto {
  @ApiProperty({
    description: "The listening ID this part belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  listening_id: string;

  @ApiProperty({
    description: "The part number",
    enum: ListeningPartEnum,
    example: ListeningPartEnum.PART_1,
  })
  @IsEnum(ListeningPartEnum)
  @IsNotEmpty()
  part: ListeningPartEnum;

  @ApiProperty({
    description: "The listening part title",
    example: "A conversation between two students",
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: "The audio ID for this part",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  audio_id?: string;

  @ApiProperty({
    description: "Answer keys for the questions",
    example: { "1": "library", "2": "Tuesday", "3": "3pm" },
    required: false,
  })
  @IsObject()
  @IsOptional()
  answers?: Record<string, any>;

  @ApiProperty({
    description: "Audio for this listening part",
    type: ListeningPartAudioDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => ListeningPartAudioDto)
  @IsOptional()
  audio?: ListeningPartAudioDto;

  @ApiProperty({
    description: "Questions for this listening part",
    type: [ListeningPartQuestionDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListeningPartQuestionDto)
  @IsOptional()
  questions?: ListeningPartQuestionDto[];
}
