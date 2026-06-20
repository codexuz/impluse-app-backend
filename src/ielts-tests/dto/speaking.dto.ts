import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsInt,
  IsBoolean,
  Min,
  Max,
  ValidateNested,
  IsArray,
} from "class-validator";
import { PaginationDto } from "./query.dto.js";

export enum SpeakingPartEnum {
  PART_1 = "PART_1",
  PART_2 = "PART_2",
  PART_3 = "PART_3",
}

export enum SpeakingModeEnum {
  PRACTICE = "practice",
  MOCK = "mock",
}

// ==================== Speaking topic ====================

export class CreateSpeakingDto {
  @ApiProperty({ description: "Title of the speaking topic", example: "Daily Life & Hometown" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: "Description of the topic", required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: "Test this topic belongs to", required: false })
  @IsUUID()
  @IsOptional()
  test_id?: string;

  @ApiProperty({ enum: SpeakingModeEnum, default: SpeakingModeEnum.PRACTICE, required: false })
  @IsEnum(SpeakingModeEnum)
  @IsOptional()
  mode?: SpeakingModeEnum;

  @ApiProperty({
    description: "Realtime voice for the AI examiner (e.g. alloy, verse, marin)",
    required: false,
    example: "alloy",
  })
  @IsString()
  @IsOptional()
  voice?: string;

  @ApiProperty({ default: true, required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class UpdateSpeakingDto extends PartialType(CreateSpeakingDto) {}

// ==================== Speaking part ====================

export class CreateSpeakingPartDto {
  @ApiProperty({ description: "The speaking topic this part belongs to" })
  @IsUUID()
  @IsNotEmpty()
  speaking_id: string;

  @ApiProperty({ enum: SpeakingPartEnum, example: SpeakingPartEnum.PART_1 })
  @IsEnum(SpeakingPartEnum)
  @IsNotEmpty()
  part: SpeakingPartEnum;

  @ApiProperty({ description: "Topic/title of the part", required: false, example: "Hometown" })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: "Cue card text (PART_2 only)",
    required: false,
    example:
      "Describe a place you like to visit. You should say where it is, how often you go there, what you do there, and explain why you like it.",
  })
  @IsString()
  @IsOptional()
  cue_card?: string;

  @ApiProperty({ description: "Preparation time in seconds (PART_2)", default: 60, required: false })
  @IsInt()
  @Min(0)
  @Max(600)
  @IsOptional()
  prep_seconds?: number;

  @ApiProperty({ description: "Speaking time in seconds (PART_2)", default: 120, required: false })
  @IsInt()
  @Min(0)
  @Max(600)
  @IsOptional()
  speak_seconds?: number;

  @ApiProperty({ description: "Order of the part", default: 0, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}

export class UpdateSpeakingPartDto extends PartialType(CreateSpeakingPartDto) {}

// ==================== Speaking question ====================

export class CreateSpeakingQuestionDto {
  @ApiProperty({ description: "The part this question belongs to" })
  @IsUUID()
  @IsNotEmpty()
  part_id: string;

  @ApiProperty({ description: "The question text", example: "Where is your hometown?" })
  @IsString()
  @IsNotEmpty()
  question_text: string;

  @ApiProperty({ description: "Order the examiner asks the question", default: 0, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}

export class UpdateSpeakingQuestionDto extends PartialType(CreateSpeakingQuestionDto) {}

export class BulkCreateSpeakingQuestionsDto {
  @ApiProperty({ description: "The part these questions belong to" })
  @IsUUID()
  @IsNotEmpty()
  part_id: string;

  @ApiProperty({
    description: "Questions to create (text + optional order)",
    type: [CreateSpeakingQuestionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSpeakingQuestionDto)
  questions: Omit<CreateSpeakingQuestionDto, "part_id">[];
}

// ==================== Queries ====================

export class SpeakingQueryDto extends PaginationDto {
  @ApiProperty({ required: false, description: "Filter by test ID" })
  @IsString()
  @IsOptional()
  testId?: string;

  @ApiProperty({ enum: SpeakingModeEnum, required: false })
  @IsEnum(SpeakingModeEnum)
  @IsOptional()
  mode?: SpeakingModeEnum;

  @ApiProperty({ required: false, description: "Filter by active status" })
  @Transform(({ value }) => value === "true" || value === true)
  @IsOptional()
  isActive?: boolean;
}

export class SpeakingPartQueryDto extends PaginationDto {
  @ApiProperty({ required: false, description: "Filter by speaking topic ID" })
  @IsString()
  @IsOptional()
  speakingId?: string;

  @ApiProperty({ enum: SpeakingPartEnum, required: false })
  @IsEnum(SpeakingPartEnum)
  @IsOptional()
  part?: SpeakingPartEnum;
}

export class SpeakingQuestionQueryDto extends PaginationDto {
  @ApiProperty({ required: false, description: "Filter by part ID" })
  @IsString()
  @IsOptional()
  partId?: string;
}

export class SpeakingAttemptQueryDto extends PaginationDto {
  @ApiProperty({ required: false, description: "Filter by speaking topic ID" })
  @IsString()
  @IsOptional()
  speakingId?: string;
}
