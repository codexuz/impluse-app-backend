import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsUUID, IsInt, Min } from "class-validator";

export class CreateCourseSectionDto {
  @ApiProperty({ description: "Course ID" })
  @IsUUID()
  @IsNotEmpty()
  course_id: string;

  @ApiProperty({ description: "Section title", example: "Introduction" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: "Section position", example: 1 })
  @IsInt()
  @Min(1)
  position: number;
}
