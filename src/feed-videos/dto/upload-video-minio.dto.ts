import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsNumber } from "class-validator";

export class UploadVideoMinioDto {
  @ApiProperty({
    type: "string",
    format: "binary",
    description: "Video file to upload",
  })
  file: any;

  @ApiProperty({
    description: "Video title",
    example: "My Speaking Practice Video",
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: "Video description",
    example: "Practicing IELTS speaking part 2",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Associated task ID",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  taskId?: number;
}
