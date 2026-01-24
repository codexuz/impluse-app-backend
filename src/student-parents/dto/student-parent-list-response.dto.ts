import { ApiProperty } from "@nestjs/swagger";
import { StudentParent } from "../entities/student_parents.entity.js";

export class StudentParentListResponseDto {
  @ApiProperty({
    description: "Array of student parents",
    type: [StudentParent],
  })
  data: StudentParent[];

  @ApiProperty({
    description: "Total number of records",
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: "Current page number",
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: "Number of items per page",
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: "Total number of pages",
    example: 10,
  })
  totalPages: number;
}
