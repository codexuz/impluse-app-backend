import { ApiProperty } from "@nestjs/swagger";

export class TextToVoiceResponseDto {
  @ApiProperty({
    description: "Indicates if the request was successful",
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: "Audio buffer data",
    type: "string",
    format: "binary",
    example: "Binary audio buffer",
  })
  audioData: Buffer;

  @ApiProperty({
    description: "Error message if request failed",
    required: false,
  })
  error?: string;
}
