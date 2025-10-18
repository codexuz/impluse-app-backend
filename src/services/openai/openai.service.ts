import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { ConfigService } from "@nestjs/config";
import {
  Agent,
  AgentInputItem,
  run,
  setDefaultOpenAIKey,
  setTracingDisabled,
} from "@openai/agents";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  private speakingAgent: Agent;
  private grammarAgent: Agent;

  private responseFormat = z.object({
    fluency: z.number(),
    pronunciation: z.number(),
    grammar: z.number(),
    vocabulary: z.number(),
    fluencyFeedback: z.string(),
    grammarFeedback: z.string(),
    pronunciationFeedback: z.string(),
    vocabularyFeedback: z.string(),
    feedback: z.string(),
  });


  constructor(private readonly configService: ConfigService) {
    const api_key = this.configService.get<string>("openAiKey");
    this.openai = new OpenAI({
      apiKey: api_key,
    });

    // Set default OpenAI key for agents and tracing
    setDefaultOpenAIKey(api_key);
    setTracingDisabled(true);


    this.grammarAgent = new Agent({
     name: "English Grammar Teacher",
     instructions: `You are a professional English teacher. Your only job is to help students improve their grammar and vocabulary.
          You must:
          - Correct grammar mistakes clearly and politely
          - Explain grammar rules in a simple, understandable way
          - Teach new vocabulary with definitions, example sentences, and usage
          - Give exercises, quizzes, or practice questions if the student wants
          - Use CEFR levels (A1 to C2) or IELTS band levels to adjust your teaching

          Do NOT:
          - Make jokes or casual conversation
          - Talk about yourself, AI, or anything unrelated to grammar and vocabulary
          - Answer personal or off-topic questions

          If the user writes a sentence, you should:
          1. Check and correct the grammar and vocabulary
          2. Explain the correction briefly
          3. Offer a better version (if needed)

          If the user says something off-topic, respond with:
          > "Let’s stay focused on English grammar and vocabulary. How can I help you with that?"

          Speak professionally, like a real English teacher in a classroom. Always stay in character.
          `,
   });

    this.speakingAgent = new Agent({
      name: "English Teacher",
      instructions: `You are an English-speaking practice assistant. Your only role is to help students improve their spoken English through conversation. Act like a professional language teacher during speaking practice sessions. Only respond in English. Do not switch to other languages. Use simple, clear English when speaking to beginner students, and more complex, natural English for advanced learners. You must:
          - Ask speaking questions (e.g., IELTS-style, CEFR A1–C2 level)
          - Engage the user in conversation and encourage them to speak more
          - Correct grammar or pronunciation when needed
          - Give short, helpful feedback if asked
          - Stay within the topic of English learning and speaking only

          Do NOT:
          - Talk about yourself, ChatGPT, AI, or your identity
          
          Stay in role at all times as a speaking practice teacher.`,
      model: "gpt-4o-mini",
      modelSettings: {
        temperature: 0.1,
        maxTokens: 3000,
      },
      outputType: "text"
    });
  }



  async chatCompletion(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
  ) {
    return await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });
  }

  async assessSpeaking(userResponse: string) {
    const result = await this.openai.responses.parse({
      model: "ft:gpt-4o-mini-2024-07-18:examonline:cefr-assessment:Bd7Shpgm",
      input: [
        {
          role: "system",
          content:
            "You are an IELTS examiner scoring a response and giving feedback, score 0-100 percent",
        },
        {
          role: "user",
          content: userResponse,
        },
      ],
      text: {
        format: zodTextFormat(this.responseFormat, "response"),
      },
    });

    return result.output_parsed;
  }

  async agentBotChat(prompt: string) {
    let thread: AgentInputItem[] = [];

    const result = await run(
      this.speakingAgent,
      thread.concat({ role: "user", content: prompt })
    );

    // Wait for the run to complete and return the final output
    return result?.finalOutput;
  }

  async grammarBotChat(prompt: string) {
    let thread: AgentInputItem[] = [];

    const result = await run(
      this.grammarAgent,
      thread.concat({ role: "user", content: prompt })
    );

    // Wait for the run to complete and return the final output
    return result?.finalOutput;
  }
}


