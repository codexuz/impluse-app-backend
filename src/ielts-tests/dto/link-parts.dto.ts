import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty, IsOptional, IsInt, Min } from "class-validator";

export class LinkReadingPartDto {
  @ApiProperty({ description: "The reading section ID" })
  @IsUUID()
  @IsNotEmpty()
  reading_id: string;

  @ApiProperty({ description: "The reading part ID" })
  @IsUUID()
  @IsNotEmpty()
  reading_part_id: string;

  @ApiPropertyOptional({ description: "Display order" })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}

export class LinkListeningPartDto {
  @ApiProperty({ description: "The listening section ID" })
  @IsUUID()
  @IsNotEmpty()
  listening_id: string;

  @ApiProperty({ description: "The listening part ID" })
  @IsUUID()
  @IsNotEmpty()
  listening_part_id: string;

  @ApiPropertyOptional({ description: "Display order" })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}

export class LinkWritingTaskDto {
  @ApiProperty({ description: "The writing section ID" })
  @IsUUID()
  @IsNotEmpty()
  writing_id: string;

  @ApiProperty({ description: "The writing task ID" })
  @IsUUID()
  @IsNotEmpty()
  writing_task_id: string;

  @ApiPropertyOptional({ description: "Display order" })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}

export class UnlinkReadingPartDto {
  @ApiProperty({ description: "The reading section ID" })
  @IsUUID()
  @IsNotEmpty()
  reading_id: string;

  @ApiProperty({ description: "The reading part ID" })
  @IsUUID()
  @IsNotEmpty()
  reading_part_id: string;
}

export class UnlinkListeningPartDto {
  @ApiProperty({ description: "The listening section ID" })
  @IsUUID()
  @IsNotEmpty()
  listening_id: string;

  @ApiProperty({ description: "The listening part ID" })
  @IsUUID()
  @IsNotEmpty()
  listening_part_id: string;
}

export class UnlinkWritingTaskDto {
  @ApiProperty({ description: "The writing section ID" })
  @IsUUID()
  @IsNotEmpty()
  writing_id: string;

  @ApiProperty({ description: "The writing task ID" })
  @IsUUID()
  @IsNotEmpty()
  writing_task_id: string;
}
