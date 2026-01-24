import { IsNotEmpty, IsInt, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateJudgeDto {
  @ApiProperty({ description: "Audio ID to judge", example: 123 })
  @IsNotEmpty()
  @IsInt()
  audioId: number;

  @ApiProperty({
    description: "Rating (0-5)",
    example: 4,
    minimum: 0,
    maximum: 5,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(5)
  rating: number;
}
