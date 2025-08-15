import { AiChatBotService } from './ai-chat-bot.service.js';
import { CreateAiChatBotDto } from './dto/create-ai-chat-bot.dto.js';
import { EditMessageDto } from './dto/edit-message.dto.js';
import { DeleteMessageDto } from './dto/delete-message.dto.js';
export declare class AiChatBotController {
    private readonly aiChatBotService;
    constructor(aiChatBotService: AiChatBotService);
    create(req: any, createAiChatBotDto: CreateAiChatBotDto): Promise<import("./entities/ai-chat-bot.entity.js").chatHistory>;
    findAll(req: any): Promise<import("./entities/ai-chat-bot.entity.js").chatHistory[]>;
    clear(req: any): Promise<{
        message: string;
    }>;
    editMessage(req: any, { messageId }: EditMessageDto, editMessageDto: EditMessageDto): Promise<import("./entities/ai-chat-bot.entity.js").chatHistory>;
    deleteMessage(req: any, deleteMessageDto: DeleteMessageDto): Promise<{
        message: string;
    }>;
}
