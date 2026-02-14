import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsArray,
  IsInt,
  IsBoolean,
  IsNumber,
  IsObject,
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

export enum DifficultyEnum {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export enum QuestionTypeEnum {
  NOTE_COMPLETION = "NOTE_COMPLETION",
  TRUE_FALSE_NOT_GIVEN = "TRUE_FALSE_NOT_GIVEN",
  YES_NO_NOT_GIVEN = "YES_NO_NOT_GIVEN",
  MATCHING_INFORMATION = "MATCHING_INFORMATION",
  MATCHING_HEADINGS = "MATCHING_HEADINGS",
  SUMMARY_COMPLETION = "SUMMARY_COMPLETION",
  SUMMARY_COMPLETION_DRAG_DROP = "SUMMARY_COMPLETION_DRAG_DROP",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  SENTENCE_COMPLETION = "SENTENCE_COMPLETION",
  SHORT_ANSWER = "SHORT_ANSWER",
  TABLE_COMPLETION = "TABLE_COMPLETION",
  FLOW_CHART_COMPLETION = "FLOW_CHART_COMPLETION",
  DIAGRAM_LABELLING = "DIAGRAM_LABELLING",
  MATCHING_FEATURES = "MATCHING_FEATURES",
  MATCHING_SENTENCE_ENDINGS = "MATCHING_SENTENCE_ENDINGS",
  PLAN_MAP_LABELLING = "PLAN_MAP_LABELLING",
  MULTIPLE_ANSWER = "MULTIPLE_ANSWER",
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

// ========== Sub-question nested DTO ==========
export class ListeningPartSubQuestionDto {
  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  questionNumber?: number;

  @ApiProperty({ example: "", required: false })
  @IsString()
  @IsOptional()
  questionText?: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  points?: number;

  @ApiProperty({ example: "library", required: false })
  @IsString()
  @IsOptional()
  correctAnswer?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  explanation?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fromPassage?: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}

// ========== Option nested DTO ==========
export class ListeningPartQuestionOptionDto {
  @ApiProperty({ example: "A", required: false })
  @IsString()
  @IsOptional()
  optionKey?: string;

  @ApiProperty({ example: "The library", required: false })
  @IsString()
  @IsOptional()
  optionText?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isCorrect?: boolean;

  @ApiProperty({ example: 0, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  orderIndex?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  explanation?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fromPassage?: string;
}

// ========== Question nested DTO ==========
export class ListeningPartQuestionDto {
  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  questionNumber?: number;

  @ApiProperty({ enum: QuestionTypeEnum, required: false })
  @IsEnum(QuestionTypeEnum)
  @IsOptional()
  type?: QuestionTypeEnum;

  @ApiProperty({ example: "----", required: false })
  @IsString()
  @IsOptional()
  questionText?: string;

  @ApiProperty({ example: "Complete the notes below", required: false })
  @IsString()
  @IsOptional()
  instruction?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  context?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  headingOptions?: any;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  tableData?: any;

  @ApiProperty({ example: 5, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  points?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  explanation?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fromPassage?: string;

  @ApiProperty({ type: [ListeningPartSubQuestionDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListeningPartSubQuestionDto)
  @IsOptional()
  questions?: ListeningPartSubQuestionDto[];

  @ApiProperty({ type: [ListeningPartQuestionOptionDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListeningPartQuestionOptionDto)
  @IsOptional()
  options?: ListeningPartQuestionOptionDto[];
}

// ========== Main DTO ==========
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
    description: "Audio for this listening part",
    type: ListeningPartAudioDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => ListeningPartAudioDto)
  @IsOptional()
  audio?: ListeningPartAudioDto;

  @ApiProperty({
    description: "Time limit in minutes",
    example: 20,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  timeLimitMinutes?: number;

  @ApiProperty({
    description: "Difficulty level",
    enum: DifficultyEnum,
    required: false,
  })
  @IsEnum(DifficultyEnum)
  @IsOptional()
  difficulty?: DifficultyEnum;

  @ApiProperty({
    description: "Whether this part is active",
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: "Total number of questions",
    example: 10,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  totalQuestions?: number;

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
