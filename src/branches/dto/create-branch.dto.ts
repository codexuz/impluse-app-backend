import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateBranchDto {
  @ApiProperty({
    description: "The owner user ID of the branch",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  owner_id: string;

  @ApiProperty({
    description: "The name of the branch",
    minLength: 2,
    example: "Main Branch",
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: "The physical address of the branch",
    required: false,
    example: "123 Main Street, City, Country",
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: "The status of the branch (active/inactive)",
    required: false,
    default: true,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  status?: boolean = true;
}
