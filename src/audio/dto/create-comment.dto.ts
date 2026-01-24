import { IsNotEmpty, IsString, IsOptional, IsInt } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty({ description: "Audio ID to comment on", example: 123 })
  @IsNotEmpty()
  @IsInt()
  audioId: number;

  @ApiProperty({
    description: "Comment text",
    example: "Great audio! Your pronunciation is excellent.",
  })
  @IsNotEmpty()
  @IsString()
  comment: string;
}
