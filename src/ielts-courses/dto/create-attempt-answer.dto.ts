import { ApiProperty } from "@nestjs/swagger";
import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
} from "class-validator";

export class CreateAttemptAnswerDto {
  @ApiProperty({ description: "Attempt ID" })
  @IsUUID()
  @IsNotEmpty()
  attempt_id: string;

  @ApiProperty({ description: "Question ID" })
  @IsUUID()
  @IsNotEmpty()
  question_id: string;

  @ApiProperty({ description: "Choice ID (for choice-based)", required: false })
  @IsUUID()
  @IsOptional()
  choice_id?: string;

  @ApiProperty({
    description: "Answer text (for short_text)",
    required: false,
  })
  @IsString()
  @IsOptional()
  answer_text?: string;

  @ApiProperty({ description: "Is the answer correct", required: false })
  @IsBoolean()
  @IsOptional()
  is_correct?: boolean;
}
