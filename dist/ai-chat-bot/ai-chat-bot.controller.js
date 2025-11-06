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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { AiChatBotService } from './ai-chat-bot.service.js';
import { CreateAiChatBotDto } from './dto/create-ai-chat-bot.dto.js';
import { EditMessageDto } from './dto/edit-message.dto.js';
import { DeleteMessageDto } from './dto/delete-message.dto.js';
let AiChatBotController = class AiChatBotController {
    constructor(aiChatBotService) {
        this.aiChatBotService = aiChatBotService;
    }
    create(req, createAiChatBotDto) {
        const userId = req.user?.id || req.user?.userId || req.user?.user_id;
        if (!userId) {
            throw new Error('User ID not found in request. User object: ' + JSON.stringify(req.user));
        }
        return this.aiChatBotService.create(userId, createAiChatBotDto);
    }
    findAll(req) {
        const userId = req.user?.id || req.user?.userId || req.user?.user_id;
        if (!userId) {
            throw new Error('User ID not found in request. User object: ' + JSON.stringify(req.user));
        }
        return this.aiChatBotService.findAll(userId);
    }
    clear(req) {
        const userId = req.user?.id || req.user?.userId || req.user?.user_id;
        if (!userId) {
            throw new Error('User ID not found in request. User object: ' + JSON.stringify(req.user));
        }
        return this.aiChatBotService.clear(userId);
    }
    editMessage(req, { messageId }, editMessageDto) {
        const userId = req.user?.id || req.user?.userId || req.user?.user_id;
        if (!userId) {
            throw new Error('User ID not found in request. User object: ' + JSON.stringify(req.user));
        }
        return this.aiChatBotService.editMessage(userId, messageId, editMessageDto.content);
    }
    deleteMessage(req, deleteMessageDto) {
        const userId = req.user?.id || req.user?.userId || req.user?.user_id;
        if (!userId) {
            throw new Error('User ID not found in request. User object: ' + JSON.stringify(req.user));
        }
        return this.aiChatBotService.deleteMessage(userId, deleteMessageDto.messageId);
    }
};
__decorate([
    Post(),
    ApiOperation({ summary: 'Create a new chat message' }),
    ApiResponse({ status: 201, description: 'Chat message created successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateAiChatBotDto]),
    __metadata("design:returntype", void 0)
], AiChatBotController.prototype, "create", null);
__decorate([
    Get(),
    ApiOperation({ summary: 'Get chat history for current user' }),
    ApiResponse({ status: 200, description: 'Returns chat history.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiChatBotController.prototype, "findAll", null);
__decorate([
    Delete(),
    ApiOperation({ summary: 'Clear chat history for current user' }),
    ApiResponse({ status: 200, description: 'Chat history cleared.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiChatBotController.prototype, "clear", null);
__decorate([
    Patch('/edit-message/:messageId'),
    ApiOperation({ summary: 'Edit a chat message' }),
    ApiResponse({ status: 200, description: 'Message edited successfully.' }),
    ApiResponse({ status: 404, description: 'Message not found.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Req()),
    __param(1, Param()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, EditMessageDto,
        EditMessageDto]),
    __metadata("design:returntype", void 0)
], AiChatBotController.prototype, "editMessage", null);
__decorate([
    Delete('message/:messageId'),
    ApiOperation({ summary: 'Delete a specific chat message' }),
    ApiResponse({ status: 200, description: 'Message deleted successfully.' }),
    ApiResponse({ status: 404, description: 'Message not found.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    __param(0, Req()),
    __param(1, Param('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, DeleteMessageDto]),
    __metadata("design:returntype", void 0)
], AiChatBotController.prototype, "deleteMessage", null);
AiChatBotController = __decorate([
    ApiTags('AI Chat Bot'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
    Controller('ai-chat-bot'),
    __metadata("design:paramtypes", [AiChatBotService])
], AiChatBotController);
export { AiChatBotController };
//# sourceMappingURL=ai-chat-bot.controller.js.map