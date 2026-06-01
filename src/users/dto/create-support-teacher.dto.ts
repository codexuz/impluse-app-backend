import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsBoolean,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateSupportTeacherDto {
  @ApiProperty({
    description: "Username for login",
    example: "john_support",
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: "Password for the support teacher account",
    minLength: 6,
    example: "password123",
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: "Support teacher's first name",
    example: "John",
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: "Support teacher's last name",
    example: "Smith",
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiPropertyOptional({
    description: "Support teacher's phone number with country code",
    example: "+1234567890",
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: "Whether the support teacher account is active",
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
