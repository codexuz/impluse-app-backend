import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateAiChatBotDto } from './dto/create-ai-chat-bot.dto.js';
import { DeepseekService } from '../services/deepseek/deepseek.service.js';
import { chatHistory } from './entities/ai-chat-bot.entity.js';
import { Op } from 'sequelize';
// Import using require for CommonJS modules
import { markdownToTxt } from 'markdown-to-txt';

@Injectable()
export class AiChatBotService {
 
  

  constructor(
    @InjectModel(chatHistory)
    private chatHistoryModel: typeof chatHistory,
    private readonly deepseekService: DeepseekService,
  ) {}

  // Using the imported removeMarkdown function from the markdown-to-text package
  private convertMarkdownToText(markdown: string): string {
    if (!markdown) return '';
    return markdownToTxt(markdown);
  }

  async create(userId: string, createAiChatBotDto: CreateAiChatBotDto) {
    // Store user's message first
    const userMessage = await this.chatHistoryModel.create({
      userId,
      role: 'user',
      content: createAiChatBotDto.message,
    });

    try {
      // Get model from DTO or use default

      // Retrieve recent conversation history (last 10 messages) to provide context
      const conversationHistory = await this.chatHistoryModel.findAll({
        where: { userId },
        order: [['created_at', 'ASC']],
        limit: 1, // Limit to last 1 message for context
      });
      
      // Format conversation history for the AI
      const messages = conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));
      
      // Add current user message if it's not already in the history
      if (!messages.some(msg => 
          msg.role === 'user' && 
          msg.content === createAiChatBotDto.message)) {
        messages.push({ 
          role: 'user', 
          content: createAiChatBotDto.message 
        });
      }
      
      // Get AI response using DeepseekService with specified model
      const completion = await this.deepseekService.chatCompletion(
        messages,
      );

      let aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response';
      
      // Parse markdown to plain text if needed
      if (createAiChatBotDto.parseMarkdown !== false) {
        aiResponse = this.convertMarkdownToText(aiResponse);
      }

      // Create and store bot response after successful generation
      const botMessage = await this.chatHistoryModel.create({
        userId,
        role: 'assistant',
        content: aiResponse,
      });

      return botMessage;
    } catch (error) {
      // If there's an error, create an error message
      const errorMessage = await this.chatHistoryModel.create({
        userId,
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request.',
      });
      throw error;
    }
  }

  async findAll(userId: string) {
    return this.chatHistoryModel.findAll({
      where: { userId },
      order: [['created_at', 'ASC']], // Simple chronological order for natural user-bot alternation
    });
  }

  async clear(userId: string) {
    await this.chatHistoryModel.destroy({
      where: { userId },
    });
    return { message: 'Chat history cleared successfully' };
  }

  async editMessage(userId: string, messageId: string, content: string) {
    // Find the message to edit
    const message = await this.chatHistoryModel.findOne({
      where: { id: messageId, userId }
    });

    // Check if message exists
    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    // Check if message belongs to the user (only user messages should be editable)
    if (message.role !== 'student' && message.role !== 'admin' && message.role !== 'teacher') {
      throw new NotFoundException('You can only edit your own messages');
    }

    // Update the message
    await message.update({ content });

    // If this is a user message that has a reply, we should regenerate the AI response
    // Find the next assistant message after this user message
    const nextAssistantMessage = await this.chatHistoryModel.findOne({
      where: { 
        userId,
        role: 'assistant',
        created_at: {
          [Op.gt]: message.created_at // Get messages created after this one
        }
      },
      order: [['created_at', 'ASC']]
    });

    if (nextAssistantMessage) {
      try {
        // Regenerate response with the selected model or default
        
        // Retrieve conversation history for context
        const conversationHistory = await this.chatHistoryModel.findAll({
          where: { userId },
          order: [['created_at', 'ASC']],
          limit: 3, // Limit to last 3 messages for context
        });
        
        // Format conversation history for the AI
        const messages = conversationHistory.map(msg => {
          // If this is the message we just edited, use the new content
          if (msg.id === message.id) {
            return { role: 'user' as 'user', content };
          }
          return {
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          };
        });
        
        // Get AI response using DeepseekService
        const completion = await this.deepseekService.chatCompletion(
          messages
        );

        let aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response';
        
        // Parse markdown to plain text
        aiResponse = this.convertMarkdownToText(aiResponse);

        // Update the assistant message with new response
        await nextAssistantMessage.update({
          content: aiResponse
        });
      } catch (error) {
        await nextAssistantMessage.update({
          content: 'Sorry, I encountered an error while processing your updated message.'
        });
      }
    }

    return message;
  }

  async deleteMessage(userId: string, messageId: string) {
    // Find the message to delete
    const message = await this.chatHistoryModel.findOne({
      where: { id: messageId, userId }
    });

    // Check if message exists
    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    // Delete the message
    await message.destroy();

    return { message: 'Message deleted successfully' };
  }

}
