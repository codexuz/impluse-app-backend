import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsBoolean,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: "Username for login",
    example: "john_doe",
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: "Password for the user account",
    minLength: 6,
    example: "password123",
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: "User's first name",
    example: "John",
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: "User's last name",
    example: "Doe",
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    description: "User's level ID (UUID)",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsString()
  @IsNotEmpty()
  level_id: string;

  @ApiPropertyOptional({
    description: "User's phone number with country code",
    example: "+1234567890",
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: "Whether the user account is active",
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
