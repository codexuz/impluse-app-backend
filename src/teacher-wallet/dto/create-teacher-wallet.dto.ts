import { IsUUID, IsNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherWalletDto {
  @ApiProperty({
    description: 'Teacher ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  teacher_id: string;

  @ApiProperty({
    description: 'Wallet amount in cents or smallest currency unit',
    example: 10000,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  amount: number;
}
