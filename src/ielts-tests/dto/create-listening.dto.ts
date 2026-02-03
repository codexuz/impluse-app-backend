import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsBoolean,
} from "class-validator";

export class CreateListeningDto {
  @ApiProperty({
    description: "The title of the listening section",
    example: "Academic Listening - University Lecture",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Description of the listening section",
    example: "A lecture about environmental science",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "The test ID this listening belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  test_id?: string;

  @ApiProperty({
    description: "URL to the full audio file",
    example: "https://example.com/audio/listening-test-1.mp3",
    required: false,
  })
  @IsString()
  @IsOptional()
  full_audio_url?: string;

  @ApiProperty({
    description: "Whether the listening test is active",
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
