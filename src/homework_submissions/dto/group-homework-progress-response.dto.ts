import { ApiProperty } from "@nestjs/swagger";

export class StudentProgressDto {
  @ApiProperty({
    description: "Student ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  student_id: string;

  @ApiProperty({
    description: "Student username",
    example: "alisher_k",
  })
  username: string;

  @ApiProperty({
    description: "Student first name",
    example: "Alisher",
  })
  first_name: string;

  @ApiProperty({
    description: "Student last name",
    example: "Karimov",
  })
  last_name: string;

  @ApiProperty({
    description: "Student avatar URL",
    example: "https://example.com/avatar.jpg",
    nullable: true,
  })
  avatar_url: string;

  @ApiProperty({
    description: "Overall homework score percentage",
    example: 89,
  })
  overall_score: number;

  @ApiProperty({
    description: "Submission date",
    example: "2025-12-15",
  })
  submission_date: string;
}

export class UnitProgressDto {
  @ApiProperty({
    description: "Homework ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  homework_id: string;

  @ApiProperty({
    description: "Lesson ID",
    example: "550e8400-e29b-41d4-a716-446655440001",
  })
  lesson_id: string;

  @ApiProperty({
    description: "Lesson/Unit title",
    example: "Unit 1: Introduction to English",
  })
  lesson_title: string;

  @ApiProperty({
    description: "Homework start date",
    example: "2025-12-10",
  })
  start_date: string;

  @ApiProperty({
    description: "Homework deadline",
    example: "2025-12-17",
    nullable: true,
  })
  deadline: string;

  @ApiProperty({
    description: "List of students with their progress",
    type: [StudentProgressDto],
  })
  students: StudentProgressDto[];
}

export class GroupHomeworkProgressResponseDto {
  @ApiProperty({
    description: "Group ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  group_id: string;

  @ApiProperty({
    description: "List of units/lessons with student progress",
    type: [UnitProgressDto],
  })
  units: UnitProgressDto[];
}
