import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ArchivedStudentReason } from "../entities/archived-student.entity.js";

export class CreateArchivedStudentDto {
  @ApiProperty({
    description: "Student user ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: "Reason for archiving",
    enum: ArchivedStudentReason,
    example: ArchivedStudentReason.BOSHQA,
  })
  @IsEnum(ArchivedStudentReason)
  @IsNotEmpty()
  reason: ArchivedStudentReason;

  @ApiPropertyOptional({
    description: "Additional notes",
    example: "Student moved to another city",
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
