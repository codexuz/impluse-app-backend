import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
} from "class-validator";

export class CreateLessonContentDto {
  @ApiProperty({ example: "Introduction to TypeScript" })
  @IsString()
  title: string;

  @ApiProperty({
    example: { text: "Detailed content about TypeScript...", data: [] },
    required: false,
  })
  @IsOptional()
  content?: any;

  @ApiProperty({
    example: "https://example.com/media/typescript.mp4",
    required: false,
  })
  @IsString()
  @IsOptional()
  mediaUrl?: string;

  @ApiProperty({
    example: "url",
    enum: ["url", "youtube_url", "embed"],
    required: false,
  })
  @IsEnum(["url", "youtube_url", "embed"])
  @IsOptional()
  mediaType?: string;

  @ApiProperty({
    example: [
      "https://example.com/resource1.pdf",
      "https://example.com/resource2.docx",
    ],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  resources?: string[];

  @ApiProperty({ example: 1 })
  @IsNumber()
  order_number: number;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  lessonId?: string;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
