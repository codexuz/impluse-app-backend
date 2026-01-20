import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsOptional,
  IsDateString,
  IsBoolean,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCompensateTeacherWalletDto {
  @ApiProperty({
    description: "The ID of the teacher",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  @IsUUID()
  @IsNotEmpty()
  teacher_id: string;

  @ApiProperty({
    description: "The ID of the compensate lesson",
    example: "987fcdeb-51a2-43d1-9b23-456789012345",
    format: "uuid",
  })
  @IsUUID()
  @IsNotEmpty()
  compensate_lesson_id: string;

  @ApiProperty({
    description: "The amount to be paid",
    example: 50.0,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: "The date when payment was made",
    example: "2026-01-15T10:30:00Z",
    required: false,
    format: "date-time",
  })
  @IsDateString()
  @IsOptional()
  paid_at?: string;

  @ApiProperty({
    description: "Whether the payment has been made",
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;
}
