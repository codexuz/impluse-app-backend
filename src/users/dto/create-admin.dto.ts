import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateAdminDto {
  @ApiProperty({
    description: "Username for login",
    example: "admin_user",
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: "Password for the admin account",
    minLength: 6,
    example: "admin123456",
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: "Admin's first name",
    example: "Admin",
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: "Admin's last name",
    example: "User",
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiPropertyOptional({
    description: "Admin's phone number with country code",
    example: "+1234567890",
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: "Admin's avatar URL",
    example: "https://example.com/avatar.jpg",
  })
  @IsString()
  @IsOptional()
  avatar_url?: string;
}