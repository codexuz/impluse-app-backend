import {
  Controller,
  Post,
  Get,
  Body,
  Query,
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
      voiceChatDto.voice
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
        voiceChatDto.voice
      );

      return {
        success: true,
        textResponse: result.textResponse,
        audioData: result.audioStream,
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
      voiceChatDto.voice
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
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      console.log(`Streaming text to voice: "${text}" with voice: "${voice}"`);

      const audioBuffer = await this.voiceChatBotService.textToVoice(
        text,
        voice
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
        `Converting text to voice: "${textToVoiceDto.text}" with voice: "${textToVoiceDto.voice}"`
      );
      const audioBuffer = await this.voiceChatBotService.textToVoice(
        textToVoiceDto.text,
        textToVoiceDto.voice
      );

      return {
        success: true,
        audioData: audioBuffer,
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
          speechToTextDto.mimeType
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
}
