import { IsOptional, IsString, IsInt, Min, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";

export class QueryStudentParentDto {
  @ApiProperty({
    description: "Page number (starts from 1)",
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: "Number of items per page",
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: "Search by parent full name",
    example: "John Doe",
    required: false,
  })
  @IsOptional()
  @IsString()
  parent_name?: string;

  @ApiProperty({
    description: "Search by parent phone number",
    example: "+998901234567",
    required: false,
  })
  @IsOptional()
  @IsString()
  parent_phone?: string;

  @ApiProperty({
    description: "Search by student first name, last name, or username",
    example: "Jane",
    required: false,
  })
  @IsOptional()
  @IsString()
  student_name?: string;

  @ApiProperty({
    description: "Filter by archived status. Omit or false = active parents only, true = archived parents only",
    example: false,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  is_archived?: boolean;

  @ApiProperty({
    description: "Filter by Telegram connection. true = has Telegram, false = no Telegram, omit = all",
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === "true" || value === true) return true;
    if (value === "false" || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  has_telegram?: boolean;
}
