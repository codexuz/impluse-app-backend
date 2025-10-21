import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNumber, IsUUID, IsEnum } from "class-validator";

export class UpdateHomeworkSectionDto {
  @ApiProperty({
    description: "UUID of the exercise",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  exercise_id?: string;

  @ApiProperty({
    description: "UUID of the speaking exercise (for speaking sections)",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  speaking_id?: string;

  @ApiProperty({
    description: "Score achieved in this section (as float)",
    example: 85.5,
    required: false,
    type: "number",
  })
  @IsNumber()
  @IsOptional()
  score?: number;

  @ApiProperty({
    description: "Section type of the homework",
    enum: ["reading", "listening", "grammar", "writing", "speaking"],
    example: "reading",
    required: false,
  })
  @IsEnum(["reading", "listening", "grammar", "writing", "speaking"])
  @IsOptional()
  section?: string;

  @ApiProperty({
    description: "Student answers for the homework section (JSON object)",
    example: { question1: "answer1", question2: "answer2" },
    required: false,
  })
  @IsOptional()
  answers?: { [key: string]: any };
}
