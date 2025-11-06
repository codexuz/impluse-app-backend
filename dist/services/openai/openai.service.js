var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { ConfigService } from "@nestjs/config";
import { Agent, run, setDefaultOpenAIKey, setTracingDisabled, } from "@openai/agents";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
let OpenaiService = class OpenaiService {
    constructor(configService) {
        this.configService = configService;
        this.responseFormat = z.object({
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
        this.writingResponseFormat = z.object({
            score: z
                .number()
                .min(0)
                .max(100)
                .describe("Overall writing score from 0-100"),
            grammarScore: z
                .number()
                .min(0)
                .max(100)
                .describe("Grammar score from 0-100"),
            vocabularyScore: z
                .number()
                .min(0)
                .max(100)
                .describe("Vocabulary score from 0-100"),
            coherenceScore: z
                .number()
                .min(0)
                .max(100)
                .describe("Coherence and cohesion score from 0-100"),
            taskResponseScore: z
                .number()
                .min(0)
                .max(100)
                .describe("Task response score from 0-100"),
            grammarFeedback: z.string().describe("Grammar feedback in Uzbek"),
            vocabularyFeedback: z.string().describe("Vocabulary feedback in Uzbek"),
            coherenceFeedback: z
                .string()
                .describe("Coherence and structure feedback in Uzbek"),
            taskResponseFeedback: z
                .string()
                .describe("Task response feedback in Uzbek"),
            overallFeedback: z
                .string()
                .describe("Overall feedback and suggestions in Uzbek"),
            correctedText: z
                .string()
                .describe("Corrected version of the text with improvements"),
        });
        const api_key = this.configService.get("openAiKey");
        this.openai = new OpenAI({
            apiKey: api_key,
        });
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
            outputType: "text",
        });
    }
    async chatCompletion(messages) {
        return await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            max_tokens: 1000,
            temperature: 0.7,
        });
    }
    async assessSpeaking(userResponse) {
        const result = await this.openai.responses.parse({
            model: "ft:gpt-4o-mini-2024-07-18:examonline:cefr-assessment:Bd7Shpgm",
            input: [
                {
                    role: "system",
                    content: "You are an IELTS examiner scoring a response and giving feedback, score 0-100 percent",
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
    async assessWriting(writingText, taskType) {
        const systemPrompt = `Siz ingliz tili yozuv ko'nikmalarini baholash bo'yicha professional ekspertsiz. Sizning vazifangiz:

1. Yozuvni to'liq tahlil qiling va 0-100% orasida ball bering
2. Barcha fikr-mulohazalaringizni O'ZBEK TILIDA bering
3. Quyidagi kriteriyalar bo'yicha baholang:
   - Grammatika (0-100%): Fe'l zamonlari, gaplar tuzilishi, so'z tartibi
   - Lug'at boyligi (0-100%): So'zlar tanlovi, sinonimlar, iboralar
   - Mazmun va tuzilish (0-100%): G'oyalar ketma-ketligi, paragraflar bog'lanishi
   - Vazifaga javob (0-100%): Berilgan mavzuga mos javob berish

4. Har bir mezon bo'yicha ANIQ va FOYDALI maslahatlar bering
5. Matnning to'g'irlangan variantini taqdim eting
6. Umumiy baho va yaxshilash yo'llarini ko'rsating

Majburiy ravishda o'zbek tilida javob bering!`;
        const userPrompt = taskType
            ? `Vazifa turi: ${taskType}\n\nYozilgan matn:\n${writingText}`
            : `Yozilgan matn:\n${writingText}`;
        const result = await this.openai.responses.parse({
            model: "gpt-4o-mini",
            input: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            text: {
                format: zodTextFormat(this.writingResponseFormat, "writingAssessment"),
            },
        });
        return result.output_parsed;
    }
    async agentBotChat(prompt) {
        let thread = [];
        const result = await run(this.speakingAgent, thread.concat({ role: "user", content: prompt }));
        return result?.finalOutput;
    }
    async grammarBotChat(prompt) {
        let thread = [];
        const result = await run(this.grammarAgent, thread.concat({ role: "user", content: prompt }));
        return result?.finalOutput;
    }
};
OpenaiService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], OpenaiService);
export { OpenaiService };
//# sourceMappingURL=openai.service.js.map