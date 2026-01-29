import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  ValidateNested,
} from "class-validator";

export class ResourceDto {
  @ApiProperty({ example: "TypeScript Guide" })
  @IsString()
  name: string;

  @ApiProperty({ example: "https://example.com/resource1.pdf" })
  @IsString()
  url: string;
}

export class CreateLessonContentDto {
  @ApiProperty({ example: "Introduction to TypeScript" })
  @IsString()
  title: string;

  @ApiProperty({
    example: "Detailed content about TypeScript...",
    required: false,
  })
  @IsOptional()
  content?: string;

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
      { name: "TypeScript Guide", url: "https://example.com/resource1.pdf" },
      { name: "Documentation", url: "https://example.com/resource2.docx" },
    ],
    required: false,
    type: [ResourceDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResourceDto)
  @IsOptional()
  resources?: ResourceDto[];

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
