import OpenAI from "openai";
import { ConfigService } from "@nestjs/config";
export declare class OpenaiService {
    private readonly configService;
    private openai;
    private speakingAgent;
    private grammarAgent;
    private responseFormat;
    private writingResponseFormat;
    constructor(configService: ConfigService);
    chatCompletion(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]): Promise<OpenAI.Chat.Completions.ChatCompletion & {
        _request_id?: string | null;
    }>;
    assessSpeaking(userResponse: string): Promise<{
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
    assessWriting(writingText: string, taskType?: string): Promise<{
        score?: number;
        grammarFeedback?: string;
        vocabularyFeedback?: string;
        grammarScore?: number;
        vocabularyScore?: number;
        coherenceScore?: number;
        taskResponseScore?: number;
        coherenceFeedback?: string;
        taskResponseFeedback?: string;
        overallFeedback?: string;
        correctedText?: string;
    }>;
    agentBotChat(prompt: string): Promise<string>;
    grammarBotChat(prompt: string): Promise<string>;
}
