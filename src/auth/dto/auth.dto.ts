import { IsString, MinLength, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RequestPasswordResetDto {
  @ApiProperty({
    description: "Phone number associated with the account",
    example: "+998901234567",
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class VerifyResetCodeDto {
  @ApiProperty({
    description: "Phone number associated with the account",
    example: "+998901234567",
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: "Verification code received via SMS",
    example: "123456",
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: "Phone number associated with the account",
    example: "+998901234567",
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: "Verification code received via SMS",
    example: "123456",
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: "New password",
    minLength: 6,
    example: "newpassword123",
  })
  @IsString()
  @MinLength(6)
  new_password: string;
}

export class LoginDto {
  @ApiProperty({
    description: "Username for authentication",
    example: "john_doe",
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: "User password",
    minLength: 6,
    example: "password123",
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    description: "User phone number with country code",
    example: "+1234567890",
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: "Unique username for the account",
    example: "john_doe",
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: "Password for the account",
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

  @ApiProperty({
    description: "Parent's full name (optional)",
    example: "John Doe",
    required: false,
  })
  @IsString()
  full_name?: string;

  @ApiProperty({
    description: "Parent's phone number (optional)",
    example: "+1 (555) 123-4567",
    required: false,
  })
  @IsString()
  phone_number?: string;

  @ApiProperty({
    description: "Parent's additional phone number (optional)",
    example: "+1 (555) 987-6543",
    required: false,
  })
  @IsString()
  additional_number?: string;
}

export class JwtPayload {
  @ApiProperty({
    description: "User ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  sub: string;

  @ApiProperty({
    description: "Username",
    example: "john_doe",
  })
  username: string;

  @ApiProperty({
    description: "Phone number",
    example: "+1234567890",
  })
  phone: string;

  @ApiProperty({
    description: "Current session ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  sessionId: string;

  @ApiProperty({
    description: "User roles",
    example: ["student"],
    type: [String],
  })
  roles: string[];

  @ApiProperty({
    description: "User permissions",
    example: ["read:profile", "update:profile"],
    type: [String],
  })
  permissions: string[];

  @ApiProperty({
    description: "Token issued at timestamp",
    example: 1625097600,
    required: false,
  })
  iat?: number;

  @ApiProperty({
    description: "Token expiration timestamp",
    example: 1625184000,
    required: false,
  })
  exp?: number;
}
