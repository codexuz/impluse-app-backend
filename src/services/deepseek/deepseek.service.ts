import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DeepseekService {
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const api_key = this.configService.get<string>("openAiKey");
    this.openai = new OpenAI({
      apiKey: api_key,
    });
  }

  private readonly systemPrompt: OpenAI.Chat.Completions.ChatCompletionSystemMessageParam = {
    role: "system",
    content:
      "You are a helpful AI assistant created by Impulse Study. " +
      "If anyone asks who you are or who made you, tell them you are an AI created by Impulse Study.",
  };

  async chatCompletion(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  ) {
    return await this.openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [this.systemPrompt, ...messages],
      temperature: 0.7,
    });
  }

  async chatCompletionStream(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  ) {
    return await this.openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [this.systemPrompt, ...messages],
      temperature: 0.7,
      stream: true,
    });
  }
}
