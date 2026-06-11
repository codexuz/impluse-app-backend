import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
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

/**
 * Body for POST /speechsuper/assess. The audio arrives either as a multipart
 * `audio` file or as `audio_url`. The rest of the fields can be supplied
 * directly, or derived from `question_id` when assessing a stored question.
 */
export class AssessDto {
  @ApiProperty({ format: "uuid", description: "Student submitting the attempt" })
  @IsUUID()
  student_id: string;

  @ApiPropertyOptional({
    format: "uuid",
    description:
      "Stored question to assess against. When set, part_type / ref_text / prompt are taken from it unless overridden.",
  })
  @IsOptional()
  @IsUUID()
  question_id?: string;

  @ApiPropertyOptional({ format: "uuid" })
  @IsOptional()
  @IsUUID()
  topic_id?: string;

  @ApiPropertyOptional({ enum: PART_TYPES })
  @IsOptional()
  @IsEnum(PART_TYPES)
  part_type?: SpeechSuperPartType;

  @ApiPropertyOptional({
    description: "Reference text for scripted parts (overrides the question's)",
  })
  @IsOptional()
  @IsString()
  ref_text?: string;

  @ApiPropertyOptional({
    description: "Prompt/question for unscripted IELTS/general parts",
  })
  @IsOptional()
  @IsString()
  prompt?: string;

  @ApiPropertyOptional({
    description: "Audio URL when not uploading a file (MinIO/S3/etc.)",
  })
  @IsOptional()
  @IsString()
  audio_url?: string;

  @ApiPropertyOptional({
    description: "Audio container: wav | mp3 | opus | ogg | amr",
    default: "wav",
  })
  @IsOptional()
  @IsString()
  audio_type?: string;

  @ApiPropertyOptional({
    description:
      "Improve transcription for non-native speakers (sent as model=non_native)",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  non_native?: boolean;

  @ApiPropertyOptional({
    description: "Penalize off-topic IELTS answers (penalize_offtopic=1)",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  penalize_offtopic?: boolean;
}
