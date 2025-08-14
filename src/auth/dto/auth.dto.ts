import { IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Username for authentication',
    example: 'john_doe'
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'User password',
    minLength: 6,
    example: 'password123'
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'User phone number with country code',
    example: '+1234567890'
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Unique username for the account',
    example: 'john_doe'
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Password for the account',
    minLength: 6,
    example: 'password123'
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User\'s first name',
    example: 'John'
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'User\'s last name',
    example: 'Doe'
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;
}

export class JwtPayload {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  sub: string;

  @ApiProperty({
    description: 'Username',
    example: 'john_doe'
  })
  username: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+1234567890'
  })
  phone: string;

  @ApiProperty({
    description: 'Current session ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  sessionId: string;

  @ApiProperty({
    description: 'User roles',
    example: ['student'],
    type: [String]
  })
  roles: string[];

  @ApiProperty({
    description: 'User permissions',
    example: ['read:profile', 'update:profile'],
    type: [String]
  })
  permissions: string[];

  @ApiProperty({
    description: 'Token issued at timestamp',
    example: 1625097600,
    required: false
  })
  iat?: number;

  @ApiProperty({
    description: 'Token expiration timestamp',
    example: 1625184000,
    required: false
  })
  exp?: number;
}