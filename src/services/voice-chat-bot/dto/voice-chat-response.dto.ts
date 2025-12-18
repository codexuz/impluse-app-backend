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
    description: "Audio data encoded as base64 string",
    type: "string",
    example: "UklGRiQAAABXQVZFZm10IBAAAA...",
  })
  audioData: string;

  @ApiProperty({
    description: "Encoding format of audio data",
    example: "base64",
  })
  encoding: string;
}
