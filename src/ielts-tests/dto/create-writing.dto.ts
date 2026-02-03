import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsBoolean,
} from "class-validator";

export class CreateWritingDto {
  @ApiProperty({
    description: "The title of the writing section",
    example: "IELTS Writing Task 1 & 2",
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: "Description of the writing section",
    example: "Academic writing tasks for IELTS preparation",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "The test ID this writing belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  test_id?: string;

  @ApiProperty({
    description: "Whether the writing test is active",
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
