import { ApiProperty } from "@nestjs/swagger";

export enum DayTimeType {
  ODD = "odd",
  EVEN = "even",
  BOTH = "both",
}

export class LessonScheduleResponseDto {
  @ApiProperty({
    description: "The unique identifier for the lesson schedule",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  id: string;

  @ApiProperty({
    description: "The ID of the group for this lesson schedule",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  group_id: string;

  @ApiProperty({
    description: "The group details",
  })
  group?: any;

  @ApiProperty({
    description: "The room number where the lesson will take place",
    example: "Room 101",
  })
  room_number: string;

  @ApiProperty({
    description: "The day time pattern (odd weeks, even weeks, or both)",
    example: "both",
    enum: DayTimeType,
  })
  day_time: DayTimeType;

  @ApiProperty({
    description: "The start time of the lesson",
    example: "09:00 AM",
  })
  start_time?: string;

  @ApiProperty({
    description: "The end time of the lesson",
    example: "10:30 AM",
  })
  end_time?: string;

  @ApiProperty({
    description: "When the lesson schedule was created",
    example: "2024-09-10T12:00:00Z",
  })
  created_at: Date;

  @ApiProperty({
    description: "When the lesson schedule was last updated",
    example: "2024-09-10T12:00:00Z",
  })
  updated_at: Date;
}
