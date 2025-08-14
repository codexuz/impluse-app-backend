import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class LeadStatsByDateRangeDto {
  @ApiProperty({
    description: 'Start date for statistics query (YYYY-MM-DD)',
    example: '2025-07-01',
    required: false
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: 'End date for statistics query (YYYY-MM-DD)',
    example: '2025-07-31',
    required: false
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
