import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum DayTimeType {
  ODD = "odd",
  EVEN = "even",
  BOTH = "both",
}

export class CreateLessonScheduleDto {
  @ApiProperty({
    description: "The ID of the group for this lesson schedule",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  @IsUUID()
  @IsNotEmpty()
  group_id: string;

  @ApiProperty({
    description: "The room number where the lesson will take place",
    example: "Room 101",
  })
  @IsString()
  @IsNotEmpty()
  room_number: string;

  @ApiProperty({
    description: "The day time pattern (odd weeks, even weeks, or both)",
    example: "both",
    enum: DayTimeType,
  })
  @IsEnum(DayTimeType)
  @IsNotEmpty()
  day_time: DayTimeType;

  @ApiProperty({
    description: "The start time of the lesson (Date format)",
    example: "2025-09-13T09:00:00Z",
    required: false,
  })
  @IsOptional()
  start_time?: Date;

  @ApiProperty({
    description: "The end time of the lesson (Date format)",
    example: "2025-09-13T10:30:00Z",
    required: false,
  })
  @IsOptional()
  end_time?: Date;
}
