import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  Res,
  Header,
  StreamableFile,
} from "@nestjs/common";
import { Response } from "express";
import { VoiceChatBotService } from "./voice-chat-bot.service.js";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
  VoiceChatDto,
  TextToVoiceDto,
  SpeechToTextDto,
  VoiceChatResponseDto,
  TextToVoiceResponseDto,
} from "./dto/index.js";

@ApiTags("Voice Chat Bot")
@Controller("voice-chat-bot")
export class VoiceChatBotController {
  constructor(private readonly voiceChatBotService: VoiceChatBotService) {}

  @Post("chat")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Process chat - returns text response" })
  @ApiResponse({ status: 200, description: "Chat response with text" })
  async voiceChat(@Body() voiceChatDto: VoiceChatDto) {
    const result = await this.voiceChatBotService.processVoiceChat(
      voiceChatDto.text,
      voiceChatDto.voice,
    );

    return {
      textResponse: result.textResponse,
      hasAudio: true,
      message: "Use /voice-chat-bot/chat-stream for audio stream",
    };
  }

  @Post("chat-stream")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get voice chat response as audio buffer" })
  @ApiResponse({
    status: 200,
    description: "Audio buffer with text response",
    type: VoiceChatResponseDto,
  })
  async voiceChatStream(@Body() voiceChatDto: VoiceChatDto) {
    try {
      const result = await this.voiceChatBotService.processVoiceChat(
        voiceChatDto.text,
        voiceChatDto.voice,
      );

      return {
        success: true,
        textResponse: result.textResponse,
        audioData: result.audioStream.toString("base64"),
        encoding: "base64",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post("generate-audio")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Generate voice response (non-streaming)" })
  @ApiResponse({ status: 200, description: "Voice response with audio data" })
  async generateVoiceResponse(@Body() voiceChatDto: VoiceChatDto) {
    return await this.voiceChatBotService.generateVoiceResponse(
      voiceChatDto.text,
      voiceChatDto.voice,
    );
  }

  @Get("text-to-voice")
  @ApiOperation({
    summary: "Stream text to voice audio (GET with query params)",
  })
  @ApiResponse({
    status: 200,
    description: "Audio stream",
    content: {
      "audio/mpeg": {
        schema: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async textToVoiceStream(
    @Query("text") text: string,
    @Query("voice") voice: string = "lauren",
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      console.log(`Streaming text to voice: "${text}" with voice: "${voice}"`);

      const audioBuffer = await this.voiceChatBotService.textToVoice(
        text,
        voice,
      );

      // Set headers for audio streaming
      res.set({
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
        "Cache-Control": "no-cache",
        "Accept-Ranges": "bytes",
      });

      return new StreamableFile(audioBuffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post("text-to-voice")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Convert any text to voice (returns audio buffer in JSON)",
  })
  @ApiResponse({
    status: 200,
    description: "Audio buffer data",
    type: TextToVoiceResponseDto,
  })
  async textToVoice(@Body() textToVoiceDto: TextToVoiceDto) {
    try {
      console.log(
        `Converting text to voice: "${textToVoiceDto.text}" with voice: "${textToVoiceDto.voice}"`,
      );
      const audioBuffer = await this.voiceChatBotService.textToVoice(
        textToVoiceDto.text,
        textToVoiceDto.voice,
      );

      return {
        success: true,
        audioData: audioBuffer.toString("base64"),
        encoding: "base64",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post("speech-to-text")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Convert speech audio to text (transcription)" })
  @ApiResponse({ status: 200, description: "Transcribed text from the audio" })
  async speechToText(@Body() speechToTextDto: SpeechToTextDto) {
    try {
      const transcribedText =
        await this.voiceChatBotService.speechToTextFromBase64(
          speechToTextDto.base64Audio,
          speechToTextDto.mimeType,
        );

      return {
        success: true,
        text: transcribedText,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post("text-to-voice-url")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Convert text to voice and save file, returns URL",
  })
  @ApiResponse({
    status: 200,
    description: "File saved successfully with URL",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        url: {
          type: "string",
          example:
            "https://backend.impulselc.uz/uploads/voice-audio/tts-1234567890-lauren.mp3",
        },
        filename: { type: "string", example: "tts-1234567890-lauren.mp3" },
      },
    },
  })
  async textToVoiceUrl(@Body() textToVoiceDto: TextToVoiceDto) {
    try {
      const result = await this.voiceChatBotService.textToVoiceAndSave(
        textToVoiceDto.text,
        textToVoiceDto.voice || "lauren",
      );

      return {
        success: true,
        url: result.url,
        filename: result.filename,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get("text-to-voice-url")
  @ApiOperation({
    summary: "Convert text to voice and save file (GET with query params)",
  })
  @ApiResponse({
    status: 200,
    description: "File saved successfully with URL",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        url: {
          type: "string",
          example:
            "https://backend.impulselc.uz/uploads/voice-audio/tts-1234567890-lauren.mp3",
        },
        filename: { type: "string", example: "tts-1234567890-lauren.mp3" },
      },
    },
  })
  async textToVoiceUrlGet(
    @Query("text") text: string,
    @Query("voice") voice: string = "lauren",
  ) {
    try {
      const result = await this.voiceChatBotService.textToVoiceAndSave(
        text,
        voice,
      );

      return {
        success: true,
        url: result.url,
        filename: result.filename,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get("serve-audio/:filename")
  @ApiOperation({
    summary: "Serve audio file directly (bypasses static file middleware)",
  })
  @ApiResponse({
    status: 200,
    description: "Audio file stream",
    content: {
      "audio/mpeg": {
        schema: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async serveAudio(
    @Param("filename") filename: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const path = await import("path");
      const fs = await import("fs/promises");

      // Sanitize filename to prevent directory traversal
      const sanitizedFilename = path.basename(filename);
      const filePath = path.join(
        process.cwd(),
        "uploads",
        "voice-audio",
        sanitizedFilename,
      );

      // Check if file exists
      await fs.access(filePath);
      const fileBuffer = await fs.readFile(filePath);

      // Set headers to prevent any encoding issues
      res.set({
        "Content-Type": "audio/mpeg",
        "Content-Length": fileBuffer.length.toString(),
        "Content-Disposition": `inline; filename="${sanitizedFilename}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Accept-Ranges": "none", // Disable range requests to avoid 206 issues
      });

      // Explicitly ensure no content-encoding
      res.removeHeader("Content-Encoding");

      return new StreamableFile(fileBuffer);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND);
      return {
        success: false,
        error: "Audio file not found",
      };
    }
  }

  @Get("tts-audio-files")
  @ApiOperation({
    summary: "Get all TTS audio files from S3 storage",
  })
  @ApiResponse({
    status: 200,
    description: "List of TTS audio files with presigned URLs",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        files: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
                example: "speaking-tts-audio/tts-1234567890-lauren.mp3",
              },
              size: { type: "number", example: 12345 },
              lastModified: { type: "string", format: "date-time" },
              url: { type: "string", example: "https://s3.amazonaws.com/..." },
            },
          },
        },
        count: { type: "number", example: 10 },
      },
    },
  })
  async getTtsAudioFiles() {
    try {
      const files = await this.voiceChatBotService.getAllTtsAudioFiles();

      return {
        success: true,
        files,
        count: files.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
