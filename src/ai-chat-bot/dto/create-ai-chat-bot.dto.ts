import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAiChatBotDto {
  @ApiProperty({
    description: "The message to send to the AI chatbot",
    example: "Hello, how can you help me today?",
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
