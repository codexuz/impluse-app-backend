import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsObject,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { MockTestMetaDto } from "./create-mock-test.dto.js";

export class UpdateMockTestDto {
  @ApiPropertyOptional({ description: "The student user ID" })
  @IsUUID()
  @IsOptional()
  user_id?: string;

  @ApiPropertyOptional({ description: "The IELTS test ID" })
  @IsUUID()
  @IsOptional()
  test_id?: string;

  @ApiPropertyOptional({ description: "The group ID" })
  @IsUUID()
  @IsOptional()
  group_id?: string;

  @ApiPropertyOptional({ description: "The teacher ID" })
  @IsUUID()
  @IsOptional()
  teacher_id?: string;

  @ApiPropertyOptional({ description: "Title of the mock test" })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: "Listening confirmed" })
  @IsBoolean()
  @IsOptional()
  listening_confirmed?: boolean;

  @ApiPropertyOptional({ description: "Reading confirmed" })
  @IsBoolean()
  @IsOptional()
  reading_confirmed?: boolean;

  @ApiPropertyOptional({ description: "Writing confirmed" })
  @IsBoolean()
  @IsOptional()
  writing_confirmed?: boolean;

  @ApiPropertyOptional({ description: "Listening finished" })
  @IsBoolean()
  @IsOptional()
  listening_finished?: boolean;

  @ApiPropertyOptional({ description: "Reading finished" })
  @IsBoolean()
  @IsOptional()
  reading_finished?: boolean;

  @ApiPropertyOptional({ description: "Writing finished" })
  @IsBoolean()
  @IsOptional()
  writing_finished?: boolean;

  @ApiPropertyOptional({ description: "Archive the mock test" })
  @IsBoolean()
  @IsOptional()
  archived?: boolean;

  @ApiPropertyOptional({ description: "Meta data with video URLs" })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => MockTestMetaDto)
  meta?: MockTestMetaDto;
}
