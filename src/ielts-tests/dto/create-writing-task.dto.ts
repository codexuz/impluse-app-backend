import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
} from "class-validator";

export enum WritingTaskEnum {
  TASK_1 = "TASK_1",
  TASK_2 = "TASK_2",
}

export class CreateWritingTaskDto {
  @ApiProperty({
    description: "The writing ID this task belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  writing_id: string;

  @ApiProperty({
    description: "The task number",
    enum: WritingTaskEnum,
    example: WritingTaskEnum.TASK_1,
  })
  @IsEnum(WritingTaskEnum)
  @IsNotEmpty()
  task: WritingTaskEnum;

  @ApiProperty({
    description: "The writing prompt/question",
    example:
      "The chart below shows the percentage of households in different countries...",
    required: false,
  })
  @IsString()
  @IsOptional()
  prompt?: string;

  @ApiProperty({
    description: "Instructions for the task",
    example:
      "Summarize the information by selecting and reporting the main features...",
    required: false,
  })
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiProperty({
    description: "Minimum word count required",
    example: 150,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  min_words?: number;

  @ApiProperty({
    description: "Suggested time in minutes",
    example: 20,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  suggested_time?: number;
}
