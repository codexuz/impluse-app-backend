import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsNumber,
} from "class-validator";

export class CreateCertificateDto {
  @ApiProperty({
    description: "The student user ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({
    description: "Name of the course",
    example: "IELTS Preparation Course",
  })
  @IsString()
  @IsNotEmpty()
  course_name: string;
}
