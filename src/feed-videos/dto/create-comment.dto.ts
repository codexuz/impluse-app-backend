import { IsNotEmpty, IsString, IsOptional, IsInt } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty({ description: "Video ID to comment on", example: 123 })
  @IsNotEmpty()
  @IsInt()
  videoId: number;

  @ApiProperty({
    description: "Comment text",
    example: "Great video! Your pronunciation is excellent.",
  })
  @IsNotEmpty()
  @IsString()
  comment: string;
}
