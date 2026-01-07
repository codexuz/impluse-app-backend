import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateStudentParentDto {
  @ApiProperty({
    description: "Student ID (UUID)",
    example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  })
  @IsNotEmpty()
  @IsUUID()
  student_id!: string;

  @ApiProperty({
    description: "Full name of the parent/guardian",
    example: "John Doe",
  })
  @IsOptional()
  @IsString()
  full_name!: string;

  @ApiProperty({
    description: "Primary phone number",
    example: "+1 (555) 123-4567",
  })
  @IsOptional()
  @IsString()
  phone_number!: string;

  @ApiProperty({
    description: "Additional phone number (optional)",
    example: "+1 (555) 987-6543",
    required: false,
  })
  @IsString()
  @IsOptional()
  additional_number?: string;
}
