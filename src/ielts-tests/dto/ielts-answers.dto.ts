import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";
import { AttemptScope } from "../entities/ielts-answer-attempt.entity.js";

// ========== Attempt DTOs ==========

export class CreateAttemptDto {
  @ApiProperty({
    description: "Scope of the attempt",
    enum: AttemptScope,
    example: AttemptScope.TEST,
  })
  @IsEnum(AttemptScope)
  @IsNotEmpty()
  scope: AttemptScope;

  @ApiPropertyOptional({
    description: "Test ID (required when scope is TEST)",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsOptional()
  test_id?: string;

  @ApiPropertyOptional({
    description: "Module ID (required when scope is MODULE)",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsOptional()
  module_id?: string;

  @ApiPropertyOptional({
    description: "Part ID (required when scope is PART)",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsOptional()
  part_id?: string;

  @ApiPropertyOptional({
    description: "Task ID (required when scope is TASK)",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsOptional()
  task_id?: string;
}

export class SubmitAttemptDto {
  @ApiProperty({
    description: "Attempt ID to submit",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  attempt_id: string;
}

// ========== Reading Answer DTOs ==========

export class SaveReadingAnswerDto {
  @ApiProperty({
    description: "Reading part ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  part_id: string;

  @ApiProperty({
    description: "Question ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  question_id: string;

  @ApiPropertyOptional({
    description: "Question number (e.g., 1, 2, 3...)",
    example: "1",
  })
  @IsString()
  @IsOptional()
  question_number?: string;

  @ApiProperty({
    description: "The user's answer",
    example: "TRUE",
  })
  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class SaveReadingAnswersDto {
  @ApiProperty({
    description: "Attempt ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  attempt_id: string;

  @ApiProperty({
    description: "Array of reading answers",
    type: [SaveReadingAnswerDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveReadingAnswerDto)
  answers: SaveReadingAnswerDto[];
}

// ========== Listening Answer DTOs ==========

export class SaveListeningAnswerDto {
  @ApiProperty({
    description: "Listening part ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  part_id: string;

  @ApiProperty({
    description: "Question ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  question_id: string;

  @ApiPropertyOptional({
    description: "Question number (e.g., 1, 2, 3...)",
    example: "1",
  })
  @IsString()
  @IsOptional()
  question_number?: string;

  @ApiProperty({
    description: "The user's answer",
    example: "hospital",
  })
  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class SaveListeningAnswersDto {
  @ApiProperty({
    description: "Attempt ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  attempt_id: string;

  @ApiProperty({
    description: "Array of listening answers",
    type: [SaveListeningAnswerDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveListeningAnswerDto)
  answers: SaveListeningAnswerDto[];
}

// ========== Writing Answer DTOs ==========

export class SaveWritingAnswerDto {
  @ApiProperty({
    description: "Writing task ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  task_id: string;

  @ApiProperty({
    description: "The user's written answer text",
    example: "The bar chart illustrates the percentage of...",
  })
  @IsString()
  @IsNotEmpty()
  answer_text: string;

  @ApiPropertyOptional({
    description: "Word count of the answer",
    example: 250,
  })
  @IsNumber()
  @IsOptional()
  word_count?: number;
}

export class SaveWritingAnswersDto {
  @ApiProperty({
    description: "Attempt ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  attempt_id: string;

  @ApiProperty({
    description: "Array of writing answers",
    type: [SaveWritingAnswerDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveWritingAnswerDto)
  answers: SaveWritingAnswerDto[];
}

// ========== Query DTOs ==========

export class AttemptQueryDto {
  @ApiPropertyOptional({ description: "Page number", example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: "Results per page", example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({
    description: "Filter by test ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsOptional()
  test_id?: string;

  @ApiPropertyOptional({
    description: "Filter by scope",
    enum: AttemptScope,
  })
  @IsEnum(AttemptScope)
  @IsOptional()
  scope?: AttemptScope;

  @ApiPropertyOptional({
    description: "Filter by status",
    enum: ["IN_PROGRESS", "SUBMITTED", "ABANDONED"],
  })
  @IsString()
  @IsOptional()
  status?: string;
}

export class StatisticsQueryDto {
  @ApiPropertyOptional({
    description: "Filter by scope",
    enum: AttemptScope,
  })
  @IsEnum(AttemptScope)
  @IsOptional()
  scope?: AttemptScope;

  @ApiPropertyOptional({
    description: "Filter by test ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsOptional()
  test_id?: string;

  @ApiPropertyOptional({
    description: "Start date filter (ISO 8601)",
    example: "2025-01-01T00:00:00.000Z",
  })
  @IsString()
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({
    description: "End date filter (ISO 8601)",
    example: "2025-12-31T23:59:59.999Z",
  })
  @IsString()
  @IsOptional()
  to?: string;
}

export class UnfinishedQueryDto {
  @ApiPropertyOptional({ description: "Page number", example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: "Results per page", example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({
    description: "Filter by scope",
    enum: AttemptScope,
  })
  @IsEnum(AttemptScope)
  @IsOptional()
  scope?: AttemptScope;

  @ApiPropertyOptional({
    description: "Include abandoned attempts as well",
    example: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  include_abandoned?: boolean;
}
