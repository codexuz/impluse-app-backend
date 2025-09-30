import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsBoolean,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateTeacherDto {
  @ApiProperty({
    description: "Username for login",
    example: "john_teacher",
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: "Password for the teacher account",
    minLength: 6,
    example: "password123",
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: "Teacher's first name",
    example: "John",
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: "Teacher's last name",
    example: "Smith",
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiPropertyOptional({
    description: "Teacher's phone number with country code",
    example: "+1234567890",
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: "Whether the teacher account is active",
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
