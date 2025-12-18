import { ApiProperty } from "@nestjs/swagger";

export class VoiceChatResponseDto {
  @ApiProperty({
    description: "Indicates if the request was successful",
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: "The text response from the AI",
    example: "Hello! How can I help you today?",
  })
  textResponse: string;

  @ApiProperty({
    description: "Audio buffer data",
    type: "string",
    format: "binary",
    example: "Binary audio buffer",
  })
  audioData: Buffer;
}
