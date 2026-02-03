import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty, IsInt, IsOptional, Min } from "class-validator";

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
    description: "Number of questions in this set",
    example: 10,
    default: 10,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  number_of_questions?: number;
}
