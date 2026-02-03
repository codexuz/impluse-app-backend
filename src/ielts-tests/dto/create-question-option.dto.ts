import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsInt,
  IsOptional,
  Min,
} from "class-validator";

export class CreateQuestionOptionDto {
  @ApiProperty({
    description: "The question content ID this option belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  question_content_id: string;

  @ApiProperty({
    description: "The value of the option",
    example: "A",
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    description: "The label/text of the option",
    example: "The Amazon rainforest",
  })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({
    description: "Display order",
    example: 1,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}
