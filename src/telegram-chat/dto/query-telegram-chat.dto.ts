import { IsOptional, IsUUID, IsBoolean, IsInt, Min } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class QueryTelegramChatDto {
  @ApiPropertyOptional({ description: "Filter by parent UUID" })
  @IsUUID()
  @IsOptional()
  parent_id?: string;

  @ApiPropertyOptional({ description: "Filter by student UUID" })
  @IsUUID()
  @IsOptional()
  student_id?: string;

  @ApiPropertyOptional({ description: "Only return unread incoming messages", default: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "true" || value === true)
  unread_only?: boolean;

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 50 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 50;
}
