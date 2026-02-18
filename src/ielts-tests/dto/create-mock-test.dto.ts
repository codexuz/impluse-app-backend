import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsObject,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class MockTestMetaDto {
  @ApiPropertyOptional({ description: "Listening video URL", default: "" })
  @IsString()
  @IsOptional()
  listening_videoUrl?: string;

  @ApiPropertyOptional({ description: "Reading video URL", default: "" })
  @IsString()
  @IsOptional()
  reading_videoUrl?: string;

  @ApiPropertyOptional({ description: "Writing video URL", default: "" })
  @IsString()
  @IsOptional()
  writing_videoUrl?: string;
}

export class CreateMockTestDto {
  @ApiProperty({ description: "The student user ID" })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ description: "The IELTS test ID" })
  @IsUUID()
  @IsNotEmpty()
  test_id: string;

  @ApiPropertyOptional({ description: "The group ID" })
  @IsUUID()
  @IsOptional()
  group_id?: string;

  @ApiPropertyOptional({ description: "The teacher ID" })
  @IsUUID()
  @IsOptional()
  teacher_id?: string;

  @ApiProperty({ description: "Title of the mock test" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: "Meta data with video URLs" })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => MockTestMetaDto)
  meta?: MockTestMetaDto;
}
