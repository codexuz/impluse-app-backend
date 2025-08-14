import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class CreateStudentBookUnitDto {
  @ApiProperty({ description: 'Student book ID' })
  @IsUUID()
  @IsNotEmpty()
  student_book_id: string;

  @ApiProperty({ description: 'Unit ID' })
  @IsUUID()
  @IsNotEmpty()
  unit_id: string;

  @ApiProperty({ description: 'Unit title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Unit URL' })
  @IsString()
  @IsNotEmpty()
  url: string;
}