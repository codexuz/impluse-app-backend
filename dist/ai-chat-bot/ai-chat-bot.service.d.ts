import { CreateAiChatBotDto } from './dto/create-ai-chat-bot.dto.js';
import { DeepseekService } from '../services/deepseek/deepseek.service.js';
import { chatHistory } from './entities/ai-chat-bot.entity.js';
export declare class AiChatBotService {
    private chatHistoryModel;
    private readonly deepseekService;
    constructor(chatHistoryModel: typeof chatHistory, deepseekService: DeepseekService);
    private convertMarkdownToText;
    create(userId: string, createAiChatBotDto: CreateAiChatBotDto): Promise<chatHistory>;
    findAll(userId: string): Promise<chatHistory[]>;
    clear(userId: string): Promise<{
        message: string;
    }>;
    editMessage(userId: string, messageId: string, content: string): Promise<chatHistory>;
    deleteMessage(userId: string, messageId: string): Promise<{
        message: string;
    }>;
}
