import { ApiProperty } from "@nestjs/swagger";

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
    description: "The name of the lesson",
    example: "Introduction to English Grammar",
  })
  lesson_name: string;

  @ApiProperty({
    description: "The date of the lesson",
    example: "2026-01-15",
    required: false,
  })
  date?: Date;

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
