import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OpenaiService } from './openai.service.js';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

class ChatCompletionDto {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

class AssessSpeakingDto {
  response: string;
}

class AgentBotChatDto {
  prompt: string;
}

@ApiTags('OpenAI')
@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('chat-completion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get chat completion from OpenAI' })
  @ApiResponse({ status: 200, description: 'Chat completion response' })
  async chatCompletion(@Body() chatCompletionDto: ChatCompletionDto) {
    return await this.openaiService.chatCompletion(chatCompletionDto.messages);
  }

  @Post('assess-speaking')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assess speaking response using fine-tuned model' })
  @ApiResponse({ status: 200, description: 'Speaking assessment results' })
  async assessSpeaking(@Body() assessSpeakingDto: AssessSpeakingDto) {
    return await this.openaiService.assessSpeaking(assessSpeakingDto.response);
  }

  @Post('agent-bot-chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Chat with AI agent bot' })
  @ApiResponse({ status: 200, description: 'Agent bot response' })
  async agentBotChat(@Body() agentBotChatDto: AgentBotChatDto) {
    return await this.openaiService.agentBotChat(agentBotChatDto.prompt);
  }



}
