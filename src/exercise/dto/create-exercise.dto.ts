import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsEnum,
  IsUrl,
} from "class-validator";

export enum ExerciseType {
  GRAMMAR = "grammar",
  READING = "reading",
  LISTENING = "listening",
  WRITING = "writing",
}

export class CreateExerciseDto {
  @ApiProperty({
    description: "Title of the exercise",
    example: "Present Simple Grammar Exercise",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Type of the exercise",
    enum: ExerciseType,
    example: ExerciseType.GRAMMAR,
  })
  @IsEnum(ExerciseType)
  @IsNotEmpty()
  exercise_type: ExerciseType;

  @ApiProperty({
    description: "Audio URL for the exercise",
    required: false,
    example: "https://example.com/audio.mp3",
  })
  @IsUrl()
  @IsOptional()
  audio_url?: string;

  @ApiProperty({
    description: "Image URL for the exercise",
    required: false,
    example: "https://example.com/image.jpg",
  })
  @IsUrl()
  @IsOptional()
  image_url?: string;

  @ApiProperty({
    description: "Video URL for the exercise",
    required: false,
    example: "https://example.com/video.mp4",
  })
  @IsUrl()
  @IsOptional()
  video_url?: string;

  @ApiProperty({
    description: "Instructions for the exercise",
    required: false,
    example: "Choose the correct answer",
  })
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiProperty({
    description: "Content of the exercise",
    required: false,
    example: "She ___ to school every day.",
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: "Whether the exercise is active",
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: "ID of the lesson this exercise belongs to",
    required: false,
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsOptional()
  lessonId?: string;
}
