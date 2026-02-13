import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  IsObject,
  Min,
} from "class-validator";

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
}

export class CreateQuestionDto {
  @ApiProperty({
    description: "The reading part ID this question belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  reading_part_id?: string;

  @ApiProperty({
    description: "The listening part ID this question belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  listening_part_id?: string;

  @ApiProperty({
    description: "The question number (e.g. 1, 8, 14)",
    example: 1,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  questionNumber?: number;

  @ApiProperty({
    description: "The question type",
    enum: QuestionTypeEnum,
    example: QuestionTypeEnum.NOTE_COMPLETION,
    required: false,
  })
  @IsEnum(QuestionTypeEnum)
  @IsOptional()
  type?: QuestionTypeEnum;

  @ApiProperty({
    description: "The question text / HTML content",
    example: "<h3>Notes</h3><ul><li>The library is open from ____</li></ul>",
    required: false,
  })
  @IsString()
  @IsOptional()
  questionText?: string;

  @ApiProperty({
    description: "Instructions for answering the question",
    example: "Complete the notes. Write ONE WORD ONLY from the text.",
    required: false,
  })
  @IsString()
  @IsOptional()
  instruction?: string;

  @ApiProperty({
    description: "Additional context for the question",
    required: false,
  })
  @IsString()
  @IsOptional()
  context?: string;

  @ApiProperty({
    description: "Heading options for matching headings type",
    required: false,
  })
  @IsObject()
  @IsOptional()
  headingOptions?: any;

  @ApiProperty({
    description: "Table data for table completion type",
    required: false,
  })
  @IsObject()
  @IsOptional()
  tableData?: any;

  @ApiProperty({
    description: "Total points for this question group",
    example: 7,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  points?: number;

  @ApiProperty({
    description: "Whether this question is active",
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: "Explanation for the question group",
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
