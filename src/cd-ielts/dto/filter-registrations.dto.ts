import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsEnum } from "class-validator";

export class FilterRegistrationsDto {
  @ApiProperty({
    description: "Filter by student ID",
    example: "uuid-student-id",
    required: false,
  })
  @IsOptional()
  @IsString()
  student_id?: string;

  @ApiProperty({
    description: "Filter by test ID",
    example: "uuid-test-id",
    required: false,
  })
  @IsOptional()
  @IsString()
  cd_test_id?: string;

  @ApiProperty({
    description: "Filter by registration status",
    example: "confirmed",
    enum: ["pending", "confirmed", "cancelled"],
    required: false,
  })
  @IsOptional()
  @IsEnum(["pending", "confirmed", "cancelled"])
  status?: string;

  @ApiProperty({
    description: "Search query for student name or phone",
    example: "John",
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
