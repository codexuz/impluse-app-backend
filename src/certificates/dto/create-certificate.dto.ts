import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsDateString,
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
    description: "Name of the certificate",
    example: "English Language Certificate",
  })
  @IsString()
  @IsNotEmpty()
  certificate_name: string;

  @ApiProperty({
    description: "Name of the course",
    example: "IELTS Preparation Course",
  })
  @IsString()
  @IsNotEmpty()
  course_name: string;

  @ApiProperty({
    description: "Certificate description",
    example: "Successfully completed the IELTS preparation course",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Issue date (YYYY-MM-DD)",
    example: "2025-12-18",
  })
  @IsDateString()
  @IsNotEmpty()
  issue_date: string;

  @ApiProperty({
    description: "Expiry date (YYYY-MM-DD)",
    example: "2027-12-18",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  expiry_date?: string;
}
