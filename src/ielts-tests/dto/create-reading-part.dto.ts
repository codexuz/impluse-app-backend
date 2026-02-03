import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsObject,
} from "class-validator";

export enum ReadingPartEnum {
  PART_1 = "PART_1",
  PART_2 = "PART_2",
  PART_3 = "PART_3",
}

export class CreateReadingPartDto {
  @ApiProperty({
    description: "The reading ID this part belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  reading_id: string;

  @ApiProperty({
    description: "The part number",
    enum: ReadingPartEnum,
    example: ReadingPartEnum.PART_1,
  })
  @IsEnum(ReadingPartEnum)
  @IsNotEmpty()
  part: ReadingPartEnum;

  @ApiProperty({
    description: "The reading passage text",
    example: "The passage text goes here...",
    required: false,
  })
  @IsString()
  @IsOptional()
  passage?: string;

  @ApiProperty({
    description: "Answer keys for the questions",
    example: { "1": "A", "2": "C", "3": "B" },
    required: false,
  })
  @IsObject()
  @IsOptional()
  answers?: Record<string, any>;
}
