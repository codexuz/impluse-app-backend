import { ApiProperty } from "@nestjs/swagger";

export class TextToVoiceResponseDto {
  @ApiProperty({
    description: "Indicates if the request was successful",
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: "Audio data encoded as base64 string",
    type: "string",
    example: "UklGRiQAAABXQVZFZm10IBAAAA...",
  })
  audioData?: string;

  @ApiProperty({
    description: "Encoding format of audio data",
    example: "base64",
    required: false,
  })
  encoding?: string;

  @ApiProperty({
    description: "Error message if request failed",
    required: false,
  })
  error?: string;
}
