import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Header,
} from '@nestjs/common';
import { Response } from 'express';
import { VoiceChatBotService } from './voice-chat-bot.service.js';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

class VoiceChatDto {
  text: string;
  voice?: string;
}

class TextToVoiceDto {
  text: string;
  voice?: string;
}

@ApiTags('Voice Chat Bot')
@Controller('voice-chat-bot')
export class VoiceChatBotController {
  constructor(private readonly voiceChatBotService: VoiceChatBotService) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process chat - returns text response' })
  @ApiResponse({ status: 200, description: 'Chat response with text' })
  async voiceChat(@Body() voiceChatDto: VoiceChatDto) {
    const result = await this.voiceChatBotService.processVoiceChat(
      voiceChatDto.text,
      voiceChatDto.voice
    );
    
    return {
      textResponse: result.textResponse,
      hasAudio: true,
      message: 'Use /voice-chat-bot/chat-stream for audio stream'
    };
  }

  @Post('chat-stream')
  @Header('Content-Type', 'audio/mpeg')
  @ApiOperation({ summary: 'Get voice chat response as audio stream' })
  @ApiResponse({ status: 200, description: 'Audio stream response' })
  async voiceChatStream(
    @Body() voiceChatDto: VoiceChatDto,
    @Res() res: Response
  ) {
    try {
      const result = await this.voiceChatBotService.processVoiceChat(
        voiceChatDto.text,
        voiceChatDto.voice
      );
      
      // Set headers for audio streaming
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="response.mp3"',
        'Cache-Control': 'no-cache',
      });
      
      // Stream the audio response
      result.audioStream.pipe(res);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Post('generate-audio')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate voice response (non-streaming)' })
  @ApiResponse({ status: 200, description: 'Voice response with audio data' })
  async generateVoiceResponse(@Body() voiceChatDto: VoiceChatDto) {
    return await this.voiceChatBotService.generateVoiceResponse(
      voiceChatDto.text,
      voiceChatDto.voice
    );
  }

  @Post('text-to-voice')
  @Header('Content-Type', 'audio/mpeg')
  @ApiOperation({ summary: 'Convert any text to voice (no AI processing)' })
  @ApiResponse({ status: 200, description: 'Audio stream of the input text' })
  async textToVoice(
    @Body() textToVoiceDto: TextToVoiceDto,
    @Res() res: Response
  ) {
    try {
      const audioStream = await this.voiceChatBotService.textToVoice(
        textToVoiceDto.text,
        textToVoiceDto.voice
      );
      
      // Set headers for audio streaming
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="text-to-speech.mp3"',
        'Cache-Control': 'no-cache',
      });
      
      // Stream the audio
      audioStream.pipe(res);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
