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

export enum TestCategory {
  AUTHENTIC = "authentic",
  PRE_TEST = "pre-test",
  CAMBRIDGE_BOOKS = "cambridge books",
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
    description: "The category of the test",
    enum: TestCategory,
    example: TestCategory.AUTHENTIC,
    required: false,
  })
  @IsEnum(TestCategory)
  @IsOptional()
  category?: TestCategory;

  created_by?: string;
}
