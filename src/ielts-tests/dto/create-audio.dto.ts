import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsInt, IsOptional, Min } from "class-validator";

export class CreateAudioDto {
  @ApiProperty({
    description: "URL to the audio file",
    example: "https://example.com/audio/part1.mp3",
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: "The filename of the audio",
    example: "listening-part1.mp3",
    required: false,
  })
  @IsString()
  @IsOptional()
  file_name?: string;

  @ApiProperty({
    description: "Duration in seconds",
    example: 180,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  duration?: number;
}
