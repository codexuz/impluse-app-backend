import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty, IsOptional, IsNumber, Min } from "class-validator";

export class CreateQuizAttemptDto {
  @ApiProperty({ description: "User ID" })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ description: "Quiz ID" })
  @IsUUID()
  @IsNotEmpty()
  quiz_id: string;

  @ApiProperty({
    description: "Score achieved",
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  score?: number;

  @ApiProperty({
    description: "Maximum possible score",
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  max_score?: number;
}
