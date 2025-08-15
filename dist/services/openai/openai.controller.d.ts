import { OpenaiService } from './openai.service.js';
declare class ChatCompletionDto {
    messages: Array<{
        role: 'system' | 'user' | 'assistant';
        content: string;
    }>;
}
declare class AssessSpeakingDto {
    response: string;
}
declare class AgentBotChatDto {
    prompt: string;
}
export declare class OpenaiController {
    private readonly openaiService;
    constructor(openaiService: OpenaiService);
    chatCompletion(chatCompletionDto: ChatCompletionDto): Promise<import("openai/resources/index.mjs").ChatCompletion & {
        _request_id?: string | null;
    }>;
    assessSpeaking(assessSpeakingDto: AssessSpeakingDto): Promise<{
        grammar?: number;
        pronunciation?: number;
        feedback?: string;
        fluency?: number;
        vocabulary?: number;
        fluencyFeedback?: string;
        grammarFeedback?: string;
        pronunciationFeedback?: string;
        vocabularyFeedback?: string;
    }>;
    agentBotChat(agentBotChatDto: AgentBotChatDto): Promise<string>;
}
export {};
