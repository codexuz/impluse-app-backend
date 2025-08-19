import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
export declare class DeepseekService {
    private readonly configService;
    private openai;
    constructor(configService: ConfigService);
    chatCompletion(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]): Promise<OpenAI.Chat.Completions.ChatCompletion & {
        _request_id?: string | null;
    }>;
}
