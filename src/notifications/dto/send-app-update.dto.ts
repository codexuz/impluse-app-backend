import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class SendAppUpdateDto {
  @ApiPropertyOptional({
    description: 'Custom message for the update notification',
    example: 'New version 2.0 is available with exciting features!'
  })
  @IsString()
  @IsOptional()
  customMessage?: string;

  @ApiPropertyOptional({
    description: 'Custom Play Store URL',
    example: 'https://play.google.com/store/apps/details?id=edu.impulse.uz'
  })
  @IsString()
  @IsOptional()
  playStoreUrl?: string;
}