import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsUUID,
  IsOptional,
} from "class-validator";

export enum TestMode {
  PRACTICE = "practice",
  MOCK = "mock",
}

export enum TestStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

export class CreateTestDto {
  @ApiProperty({
    description: "The title of the test",
    example: "IELTS Academic Practice Test 1",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "The mode of the test",
    enum: TestMode,
    example: TestMode.PRACTICE,
  })
  @IsEnum(TestMode)
  @IsNotEmpty()
  mode: TestMode;

  @ApiProperty({
    description: "The status of the test",
    enum: TestStatus,
    example: TestStatus.DRAFT,
    required: false,
  })
  @IsEnum(TestStatus)
  @IsOptional()
  status?: TestStatus;

  @ApiProperty({
    description: "The ID of the user creating the test",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  created_by: string;
}
