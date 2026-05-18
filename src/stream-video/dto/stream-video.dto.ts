import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class GenerateTokenDto {
  @ApiProperty({ description: 'User ID to generate token for' })
  @IsString()
  @IsNotEmpty()
  user_id: string;
}

export class CreateUserCallDto {
  @ApiProperty({ description: 'Unique call ID (leave empty to auto-generate)', required: false })
  @IsOptional()
  @IsString()
  call_id?: string;

  @ApiProperty({ description: 'User ID of the other participant' })
  @IsString()
  @IsNotEmpty()
  target_user_id: string;
}

export class CreateAiCallDto {
  @ApiProperty({ description: 'Unique call ID (leave empty to auto-generate)', required: false })
  @IsOptional()
  @IsString()
  call_id?: string;

  @ApiPropertyOptional({ description: 'System prompt for the AI agent' })
  @IsOptional()
  @IsString()
  system_prompt?: string;
}
