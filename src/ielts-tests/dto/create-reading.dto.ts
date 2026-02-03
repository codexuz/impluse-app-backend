import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsUUID } from "class-validator";

export class CreateReadingDto {
  @ApiProperty({
    description: "The title of the reading section",
    example: "Academic Reading - Climate Change",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "The test ID this reading belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  test_id: string;
}
