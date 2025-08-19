import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DeepseekService {
    private openai: OpenAI;

    constructor(private readonly configService: ConfigService) {
        const api_key = this.configService.get<string>('openAiKey');
        this.openai = new OpenAI({
            apiKey: api_key,
        });
    } 
    
    async chatCompletion(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]){
        return await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            temperature: 0.7,
        });
    }
}

