var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Body, HttpCode, HttpStatus, } from '@nestjs/common';
import { OpenaiService } from './openai.service.js';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
class ChatCompletionDto {
}
class AssessSpeakingDto {
}
class AgentBotChatDto {
}
let OpenaiController = class OpenaiController {
    constructor(openaiService) {
        this.openaiService = openaiService;
    }
    async chatCompletion(chatCompletionDto) {
        return await this.openaiService.chatCompletion(chatCompletionDto.messages);
    }
    async assessSpeaking(assessSpeakingDto) {
        return await this.openaiService.assessSpeaking(assessSpeakingDto.response);
    }
    async agentBotChat(agentBotChatDto) {
        return await this.openaiService.agentBotChat(agentBotChatDto.prompt);
    }
};
__decorate([
    Post('chat-completion'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Get chat completion from OpenAI' }),
    ApiResponse({ status: 200, description: 'Chat completion response' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatCompletionDto]),
    __metadata("design:returntype", Promise)
], OpenaiController.prototype, "chatCompletion", null);
__decorate([
    Post('assess-speaking'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Assess speaking response using fine-tuned model' }),
    ApiResponse({ status: 200, description: 'Speaking assessment results' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AssessSpeakingDto]),
    __metadata("design:returntype", Promise)
], OpenaiController.prototype, "assessSpeaking", null);
__decorate([
    Post('agent-bot-chat'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Chat with AI agent bot' }),
    ApiResponse({ status: 200, description: 'Agent bot response' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AgentBotChatDto]),
    __metadata("design:returntype", Promise)
], OpenaiController.prototype, "agentBotChat", null);
OpenaiController = __decorate([
    ApiTags('OpenAI'),
    Controller('openai'),
    __metadata("design:paramtypes", [OpenaiService])
], OpenaiController);
export { OpenaiController };
//# sourceMappingURL=openai.controller.js.map