import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCdIeltDto {
  @ApiProperty({ description: 'The title of the IELTS test', example: 'IELTS Academic Test - October 2025' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ 
    description: 'Status of the IELTS test',
    enum: ['active', 'full', 'inactive'],
    example: 'active' 
  })
  @IsNotEmpty()
  @IsEnum(['active', 'full', 'inactive'])
  status: string;

  @ApiProperty({ 
    description: 'The date of the IELTS test',
    example: '2025-10-15'
  })
  @IsNotEmpty()
  @IsDateString()
  exam_date: Date;

  @ApiProperty({ 
    description: 'The time of the IELTS test',
    example: '09:00 AM'
  })
  @IsNotEmpty()
  @IsString()
  time: string;

  @ApiProperty({ 
    description: 'The location of the IELTS test',
    example: 'British Council Test Center, 123 Main St'
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ 
    description: 'Number of available seats for the test',
    example: 30
  })
  @IsNotEmpty()
  @IsNumber()
  seats: number;

  @ApiProperty({ 
    description: 'The price of the IELTS test',
    example: 250.00
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
