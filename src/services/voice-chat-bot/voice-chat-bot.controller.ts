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
import { VoiceChatDto, TextToVoiceDto } from './dto/index.js';

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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get voice chat response as base64 audio' })
  @ApiResponse({ status: 200, description: 'Base64 encoded audio data with text response' })
  async voiceChatStream(
    @Body() voiceChatDto: VoiceChatDto
  ) {
    try {
      const result = await this.voiceChatBotService.processVoiceChat(
        voiceChatDto.text,
        voiceChatDto.voice
      );
      
      return {
        success: true,
        textResponse: result.textResponse,
        audioData: result.audioStream
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Convert any text to voice (returns base64 audio data)' })
  @ApiResponse({ status: 200, description: 'Base64 encoded audio data' })
  async textToVoice(
    @Body() textToVoiceDto: TextToVoiceDto
  ) {
    try {
      console.log(`Converting text to voice: "${textToVoiceDto.text}" with voice: "${textToVoiceDto.voice}"`);
      const base64Audio = await this.voiceChatBotService.textToVoice(
        textToVoiceDto.text,
        textToVoiceDto.voice
      );
      
      return {
        success: true,
        audioData: base64Audio
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
