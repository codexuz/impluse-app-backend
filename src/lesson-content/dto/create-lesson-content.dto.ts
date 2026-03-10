import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
} from "class-validator";

export class LessonContentItemDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: "text",
    enum: ["text", "image", "audio", "video", "youtube_embed", "iframe"],
  })
  @IsEnum(["text", "image", "audio", "video", "youtube_embed", "iframe"])
  type: string;

  @ApiProperty({ example: "This is a lesson paragraph..." })
  @IsString()
  content: string;
}

export class ResourceDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: "pdf",
    enum: ["pdf", "doc", "excel", "docx"],
  })
  @IsEnum(["pdf", "doc", "excel", "docx"])
  type: string;

  @ApiProperty({ example: "https://example.com/resource1.pdf" })
  @IsString()
  url: string;
}

export class CreateLessonContentDto {
  @ApiProperty({ example: "Introduction to TypeScript" })
  @IsString()
  title: string;

  @ApiProperty({
    example: [
      {
        id: 1,
        type: "text",
        content: "This is the first paragraph...",
      },
      {
        id: 2,
        type: "image",
        content: "https://example.com/image.png",
      },
    ],
    required: false,
    type: [LessonContentItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonContentItemDto)
  @IsOptional()
  content?: LessonContentItemDto[];

  @ApiProperty({
    example: [
      {
        id: 1,
        type: "pdf",
        url: "https://example.com/resource1.pdf",
      },
      {
        id: 2,
        type: "docx",
        url: "https://example.com/resource2.docx",
      },
    ],
    required: false,
    type: [ResourceDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResourceDto)
  @IsOptional()
  resources?: ResourceDto[];

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  lessonId?: string;
}
