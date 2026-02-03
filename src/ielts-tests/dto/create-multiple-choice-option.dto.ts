import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsInt,
  IsOptional,
  Min,
} from "class-validator";

export class CreateMultipleChoiceOptionDto {
  @ApiProperty({
    description: "The multiple choice question ID this option belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  multiple_choice_question_id: string;

  @ApiProperty({
    description: "The value of the option",
    example: "A",
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    description: "The label/text of the option",
    example: "Climate change and its effects",
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
