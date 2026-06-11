import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from "class-validator";
import type { SpeechSuperPartType } from "../speechsuper.constants.js";

const PART_TYPES = [
  "word",
  "sentence",
  "paragraph",
  "part1",
  "part2",
  "part3",
  "general",
];

export class CreateQuestionDto {
  @ApiProperty({ format: "uuid" })
  @IsUUID()
  topic_id: string;

  @ApiProperty({ enum: PART_TYPES })
  @IsEnum(PART_TYPES)
  part_type: SpeechSuperPartType;

  @ApiPropertyOptional({
    description: "Prompt shown for unscripted IELTS/general questions",
    example: "What's your favorite food?",
  })
  @IsOptional()
  @IsString()
  prompt?: string;

  @ApiPropertyOptional({
    description: "Reference text to read aloud (scripted word/sentence/paragraph)",
    example: "supermarket",
  })
  @IsOptional()
  @IsString()
  ref_text?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hint?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  audio_url?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
