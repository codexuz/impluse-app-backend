import { IsNotEmpty, IsOptional, IsString, IsInt } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateAudioDto {
  @ApiPropertyOptional({
    description: "Task ID this audio is responding to",
    example: 1,
  })
  @IsOptional()
  @IsInt()
  taskId?: number;

  @ApiPropertyOptional({
    description: "Audio URL (auto-generated when uploading file)",
    example: "https://storage.example.com/audios/audio123.mp3",
  })
  @IsOptional()
  @IsString()
  audioUrl?: string;

  @ApiPropertyOptional({
    description: "Audio caption/description",
    example: "My favorite food is pizza because...",
  })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({
    description: "Audio duration in seconds",
    example: 95,
  })
  @IsOptional()
  @IsInt()
  durationSeconds?: number;
}
