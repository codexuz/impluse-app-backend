import { IsInt, IsNotEmpty, IsOptional, IsDateString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AssignRoleDto {
  @ApiProperty({
    description: "Role ID to assign",
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  roleId: number;

  @ApiPropertyOptional({
    description: "Expiration date for the role assignment",
    example: "2027-12-31T23:59:59.000Z",
  })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}
