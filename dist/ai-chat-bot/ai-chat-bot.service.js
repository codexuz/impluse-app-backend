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
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DeepseekService } from '../services/deepseek/deepseek.service.js';
import { chatHistory } from './entities/ai-chat-bot.entity.js';
import { Op } from 'sequelize';
import { markdownToTxt } from 'markdown-to-txt';
let AiChatBotService = class AiChatBotService {
    constructor(chatHistoryModel, deepseekService) {
        this.chatHistoryModel = chatHistoryModel;
        this.deepseekService = deepseekService;
    }
    convertMarkdownToText(markdown) {
        if (!markdown)
            return '';
        return markdownToTxt(markdown);
    }
    async create(userId, createAiChatBotDto) {
        await this.chatHistoryModel.create({
            userId,
            role: 'user',
            content: createAiChatBotDto.message,
        });
        const thinkingMessage = await this.chatHistoryModel.create({
            userId,
            role: 'assistant',
            content: '...',
        });
        try {
            const conversationHistory = await this.chatHistoryModel.findAll({
                where: { userId },
                order: [['created_at', 'ASC']],
                limit: 1,
            });
            const messages = conversationHistory.map(msg => ({
                role: msg.role,
                content: msg.content
            }));
            if (!messages.some(msg => msg.role === 'user' &&
                msg.content === createAiChatBotDto.message)) {
                messages.push({
                    role: 'user',
                    content: createAiChatBotDto.message
                });
            }
            const completion = await this.deepseekService.chatCompletion(messages);
            let aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response';
            if (createAiChatBotDto.parseMarkdown !== false) {
                aiResponse = this.convertMarkdownToText(aiResponse);
            }
            await thinkingMessage.update({
                content: aiResponse
            });
            return thinkingMessage;
        }
        catch (error) {
            await thinkingMessage.update({
                content: 'Sorry, I encountered an error while processing your request.'
            });
            throw error;
        }
    }
    async findAll(userId) {
        return this.chatHistoryModel.findAll({
            where: { userId },
            order: [['created_at', 'ASC']],
        });
    }
    async clear(userId) {
        await this.chatHistoryModel.destroy({
            where: { userId },
        });
        return { message: 'Chat history cleared successfully' };
    }
    async editMessage(userId, messageId, content) {
        const message = await this.chatHistoryModel.findOne({
            where: { id: messageId, userId }
        });
        if (!message) {
            throw new NotFoundException(`Message with ID ${messageId} not found`);
        }
        if (message.role !== 'student' && message.role !== 'admin' && message.role !== 'teacher') {
            throw new NotFoundException('You can only edit your own messages');
        }
        await message.update({ content });
        const nextAssistantMessage = await this.chatHistoryModel.findOne({
            where: {
                userId,
                role: 'assistant',
                created_at: {
                    [Op.gt]: message.created_at
                }
            },
            order: [['created_at', 'ASC']]
        });
        if (nextAssistantMessage) {
            await nextAssistantMessage.update({ content: '...' });
            try {
                const conversationHistory = await this.chatHistoryModel.findAll({
                    where: { userId },
                    order: [['created_at', 'ASC']],
                    limit: 10,
                });
                const messages = conversationHistory.map(msg => {
                    if (msg.id === message.id) {
                        return { role: 'user', content };
                    }
                    return {
                        role: msg.role,
                        content: msg.content
                    };
                });
                const completion = await this.deepseekService.chatCompletion(messages);
                let aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response';
                aiResponse = this.convertMarkdownToText(aiResponse);
                await nextAssistantMessage.update({
                    content: aiResponse
                });
            }
            catch (error) {
                await nextAssistantMessage.update({
                    content: 'Sorry, I encountered an error while processing your updated message.'
                });
            }
        }
        return message;
    }
    async deleteMessage(userId, messageId) {
        const message = await this.chatHistoryModel.findOne({
            where: { id: messageId, userId }
        });
        if (!message) {
            throw new NotFoundException(`Message with ID ${messageId} not found`);
        }
        await message.destroy();
        return { message: 'Message deleted successfully' };
    }
};
AiChatBotService = __decorate([
    Injectable(),
    __param(0, InjectModel(chatHistory)),
    __metadata("design:paramtypes", [Object, DeepseekService])
], AiChatBotService);
export { AiChatBotService };
//# sourceMappingURL=ai-chat-bot.service.js.map