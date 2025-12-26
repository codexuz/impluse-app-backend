import {
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateJudgeDto {
  @ApiProperty({ description: "Video ID to judge", example: 123 })
  @IsNotEmpty()
  @IsInt()
  videoId: number;

  @ApiProperty({
    description: "Fluency score (1-10)",
    example: 8,
    minimum: 1,
    maximum: 10,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(10)
  fluencyScore: number;

  @ApiProperty({
    description: "Clarity score (1-10)",
    example: 9,
    minimum: 1,
    maximum: 10,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(10)
  clarityScore: number;

  @ApiPropertyOptional({
    description: "Written feedback",
    example: "Your speaking is clear but try to speak more naturally.",
  })
  @IsOptional()
  @IsString()
  feedback?: string;
}
