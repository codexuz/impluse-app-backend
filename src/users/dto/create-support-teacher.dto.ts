import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsBoolean,
  IsIn,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateStaffDto {
  @ApiProperty({ example: "john_doe" })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ minLength: 6, example: "password123" })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: "John" })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: "Smith" })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiPropertyOptional({ example: "+998901234567" })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: "Role to assign: admin, teacher, or support_teacher",
    example: "support_teacher",
    enum: ["admin", "teacher", "support_teacher"],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(["admin", "teacher", "support_teacher"])
  role: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

/** @deprecated use CreateStaffDto */
export class CreateSupportTeacherDto extends CreateStaffDto {}

