import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsObject,
} from "class-validator";

export enum ListeningPartEnum {
  PART_1 = "PART_1",
  PART_2 = "PART_2",
  PART_3 = "PART_3",
  PART_4 = "PART_4",
}

export class CreateListeningPartDto {
  @ApiProperty({
    description: "The listening ID this part belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  listening_id: string;

  @ApiProperty({
    description: "The part number",
    enum: ListeningPartEnum,
    example: ListeningPartEnum.PART_1,
  })
  @IsEnum(ListeningPartEnum)
  @IsNotEmpty()
  part: ListeningPartEnum;

  @ApiProperty({
    description: "The audio ID for this part",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  audio_id?: string;

  @ApiProperty({
    description: "Answer keys for the questions",
    example: { "1": "library", "2": "Tuesday", "3": "3pm" },
    required: false,
  })
  @IsObject()
  @IsOptional()
  answers?: Record<string, any>;
}
