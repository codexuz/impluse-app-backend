import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsInt,
  IsArray,
  ValidateNested,
  Min,
  IsIn,
} from "class-validator";
import { Type } from "class-transformer";

export class LessonContentItemDto {
  @ApiProperty({ description: "Content item ID", example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ description: "Content item type", example: "text" })
  @IsString()
  type: string;

  @ApiProperty({ description: "Content item content", example: "<p>Hello</p>" })
  @IsString()
  content: string;
}

export class LessonTrackDto {
  @ApiProperty({
    description: "Track source URL",
    example: "https://example.com/track.vtt",
  })
  @IsString()
  @IsNotEmpty()
  src: string;

  @ApiProperty({
    description: "Track language",
    enum: ["uz", "en", "ru"],
    example: "en",
  })
  @IsString()
  @IsIn(["uz", "en", "ru"])
  lang: "uz" | "en" | "ru";

  @ApiProperty({
    description: "Track label",
    enum: ["English", "O'zbekcha", "Русский"],
    example: "English",
  })
  @IsString()
  @IsIn(["English", "O'zbekcha", "Русский"])
  label: "English" | "O'zbekcha" | "Русский";
}

export class CreateLessonDto {
  @ApiProperty({ description: "Section ID" })
  @IsUUID()
  @IsNotEmpty()
  section_id: string;

  @ApiProperty({ description: "Lesson title", example: "Reading strategies" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: "Lesson position", example: 1 })
  @IsInt()
  @Min(1)
  position: number;

  @ApiProperty({
    description: "Lesson content",
    required: false,
    type: [LessonContentItemDto],
    example: [{ id: 1, type: "text", content: "<p>Hello</p>" }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonContentItemDto)
  @IsOptional()
  content?: LessonContentItemDto[];

  @ApiProperty({ description: "Duration in seconds", required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  duration_seconds?: number;

  @ApiProperty({
    description: "Lesson tracks",
    required: false,
    type: [LessonTrackDto],
    example: [
      { src: "https://example.com/track.vtt", lang: "en", label: "English" },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonTrackDto)
  @IsOptional()
  tracks?: LessonTrackDto[];
}
