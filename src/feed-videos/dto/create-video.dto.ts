import { IsNotEmpty, IsOptional, IsString, IsInt } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateVideoDto {
  @ApiPropertyOptional({
    description: "Task ID this video is responding to",
    example: 1,
  })
  @IsOptional()
  @IsInt()
  taskId?: number;

  @ApiPropertyOptional({
    description: "Video URL (auto-generated when uploading file)",
    example: "https://storage.example.com/videos/video123.mp4",
  })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional({
    description: "Video thumbnail URL",
    example: "https://storage.example.com/thumbnails/thumb123.jpg",
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    description: "Video caption/description",
    example: "My favorite food is pizza because...",
  })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({
    description: "Video duration in seconds",
    example: 95,
  })
  @IsOptional()
  @IsInt()
  durationSeconds?: number;
}
