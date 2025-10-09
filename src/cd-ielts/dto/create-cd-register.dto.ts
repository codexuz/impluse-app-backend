import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCdRegisterDto {
  @ApiProperty({ description: 'Student ID', example: '83a2aa91-4a3d-47bf-aea2-863bc7a30575' })
  @IsNotEmpty()
  @IsUUID()
  student_id: string;

  @ApiProperty({ description: 'CD IELTS Test ID', example: '5e7b5d93-87d8-4c8d-a870-b646a5e9a123' })
  @IsNotEmpty()
  @IsUUID()
  cd_test_id: string;

  @ApiProperty({ 
    description: 'Payment status',
    enum: ['paid', 'pending', 'cancelled'],
    example: 'pending' 
  })
  @IsNotEmpty()
  @IsEnum(['paid', 'pending', 'cancelled'])
  status: string;
}