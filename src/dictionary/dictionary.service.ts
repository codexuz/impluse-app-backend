import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import {
  DictionaryApiResponse,
  DictionaryResult,
  TranslatedEntry,
  TranslatedSense,
} from "./interfaces/dictionary.interface.js";
import { DictionaryHistory } from "./entities/dictionary-history.entity.js";
import { InjectModel } from "@nestjs/sequelize";

const TranslationSchema = z.object({
  definitions: z.array(
    z.object({
      original: z.string(),
      uz: z.string(),
      ru: z.string(),
    }),
  ),
  examples: z.array(
    z.object({
      original: z.string(),
      uz: z.string(),
      ru: z.string(),
    }),
  ),
});

const FallbackEntrySchema = z.object({
  entries: z.array(
    z.object({
      partOfSpeech: z.string(),
      pronunciations: z.array(
        z.object({
          type: z.literal("ipa"),
          text: z.string(),
          tags: z.array(z.string()),
        }),
      ),
      forms: z.array(
        z.object({
          word: z.string(),
          tags: z.array(z.string()),
        }),
      ),
      senses: z.array(
        z.object({
          definition: z.string(),
          definitionUz: z.string(),
          definitionRu: z.string(),
          examples: z.array(
            z.object({
              en: z.string(),
              uz: z.string(),
              ru: z.string(),
            }),
          ),
          synonyms: z.array(z.string()),
          antonyms: z.array(z.string()),
        }),
      ),
    }),
  ),
});

@Injectable()
export class DictionaryService {
  private openai: OpenAI;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectModel(DictionaryHistory)
    private readonly historyModel: typeof DictionaryHistory,
  ) {
    const apiKey = this.configService.get<string>("openAiKey");
    this.openai = new OpenAI({ apiKey });
  }

  async lookup(word: string, userId?: string): Promise<DictionaryResult> {
    const apiData = await this.fetchFromApi(word);

    // If API returned nothing (404/429), use OpenAI fallback
    if (!apiData) {
      const result = await this.fallbackWithOpenAI(word);
      if (userId) {
        await this.saveHistory(userId, word, true);
      }
      return result;
    }

    // Filter only English entries
    const englishEntries = apiData.entries.filter(
      (entry) => entry.language.code === "en",
    );

    if (englishEntries.length === 0) {
      const result = await this.fallbackWithOpenAI(word);
      if (userId) {
        await this.saveHistory(userId, word, true);
      }
      return result;
    }

    // Collect all definitions and examples for batch translation
    const definitions: string[] = [];
    const examples: string[] = [];

    for (const entry of englishEntries) {
      for (const sense of entry.senses) {
        definitions.push(sense.definition);
        examples.push(...sense.examples);
        for (const subsense of sense.subsenses) {
          definitions.push(subsense.definition);
          examples.push(...subsense.examples);
        }
      }
    }

    // Get translations in one OpenAI call
    const translations = await this.translateBatch(word, definitions, examples);

    // Map translations back to entries
    let defIdx = 0;
    let exIdx = 0;

    const translatedEntries: TranslatedEntry[] = englishEntries.map(
      (entry) => ({
        ...entry,
        senses: entry.senses.map((sense) => {
          const translatedSense: TranslatedSense = {
            ...sense,
            translations: translations.definitions[defIdx]
              ? {
                  uz: translations.definitions[defIdx].uz,
                  ru: translations.definitions[defIdx].ru,
                }
              : { uz: "", ru: "" },
            exampleTranslations: sense.examples.map((ex) => {
              const t = translations.examples[exIdx];
              exIdx++;
              return {
                original: ex,
                uz: t?.uz || "",
                ru: t?.ru || "",
              };
            }),
            subsenses: sense.subsenses.map((sub) => {
              defIdx++;
              return {
                ...sub,
                translations: translations.definitions[defIdx]
                  ? {
                      uz: translations.definitions[defIdx].uz,
                      ru: translations.definitions[defIdx].ru,
                    }
                  : { uz: "", ru: "" },
                exampleTranslations: sub.examples.map((ex) => {
                  const t = translations.examples[exIdx];
                  exIdx++;
                  return {
                    original: ex,
                    uz: t?.uz || "",
                    ru: t?.ru || "",
                  };
                }),
              } as TranslatedSense;
            }),
          };
          defIdx++;
          return translatedSense;
        }),
      }),
    );

    if (userId) {
      await this.saveHistory(userId, word, false);
    }

    return {
      word: apiData.word,
      entries: translatedEntries,
      source: apiData.source,
    };
  }

  private async saveHistory(
    userId: string,
    word: string,
    isFallback: boolean,
  ): Promise<void> {
    try {
      await this.historyModel.create({
        user_id: userId,
        word: word.trim().toLowerCase(),
        is_fallback: isFallback,
      });
    } catch {
      // Don't fail the lookup if history save fails
    }
  }

  async getUserHistory(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const offset = (page - 1) * limit;
    const { count, rows } = await this.historyModel.findAndCountAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return {
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }

  async deleteHistoryItem(userId: string, id: string): Promise<void> {
    await this.historyModel.destroy({
      where: { id, user_id: userId },
    });
  }

  private async fetchFromApi(
    word: string,
  ): Promise<DictionaryApiResponse | null> {
    const encodedWord = encodeURIComponent(word.trim().toLowerCase());
    const url = `https://freedictionaryapi.com/api/v1/entries/all/${encodedWord}`;

    try {
      const response =
        await this.httpService.axiosRef.get<DictionaryApiResponse>(url, {
          timeout: 10000,
        });
      return response.data;
    } catch (error: any) {
      const status = error?.response?.status;
      // 404 = word not found, 429 = rate limited — both fall back to OpenAI
      if (status === 404 || status === 429) {
        return null;
      }
      throw new HttpException(
        "Dictionary API unavailable",
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private async translateBatch(
    word: string,
    definitions: string[],
    examples: string[],
  ): Promise<z.infer<typeof TranslationSchema>> {
    const prompt = `You are a professional translator. Translate the following dictionary data for the English word "${word}".

Translate each definition and example sentence into both Uzbek (uz) and Russian (ru).
Keep translations natural, accurate, and appropriate for a dictionary app.

DEFINITIONS to translate:
${definitions.map((d, i) => `${i + 1}. ${d}`).join("\n")}

EXAMPLE SENTENCES to translate:
${examples.map((e, i) => `${i + 1}. ${e}`).join("\n")}

Return translations maintaining the exact same order.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: zodResponseFormat(
          TranslationSchema,
          "translations",
        ),
        temperature: 0.3,
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch {
      // Return empty translations on failure rather than crashing
      return {
        definitions: definitions.map((d) => ({
          original: d,
          uz: "",
          ru: "",
        })),
        examples: examples.map((e) => ({
          original: e,
          uz: "",
          ru: "",
        })),
      };
    }
  }

  private async fallbackWithOpenAI(word: string): Promise<DictionaryResult> {
    const prompt = `You are a professional dictionary like Cambridge Dictionary. Generate a complete dictionary entry for the English word or phrase: "${word}".

Include:
- Part of speech
- IPA pronunciations (British "Received Pronunciation" and American "General American")
- Word forms (plural, past tense, etc. where applicable)
- All senses/definitions in English
- For each definition: translate it into Uzbek (uz) and Russian (ru)
- 1-2 example sentences per definition, each translated into Uzbek and Russian
- Synonyms and antonyms where relevant

Be accurate and comprehensive like a real dictionary.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: zodResponseFormat(
          FallbackEntrySchema,
          "dictionary_entry",
        ),
        temperature: 0.3,
      });

      const content = response.choices[0].message.content;
      const parsed: z.infer<typeof FallbackEntrySchema> = JSON.parse(content);

      const translatedEntries: TranslatedEntry[] = parsed.entries.map(
        (entry) => ({
          language: { code: "en", name: "English" },
          partOfSpeech: entry.partOfSpeech,
          pronunciations: entry.pronunciations,
          forms: entry.forms,
          synonyms: [],
          antonyms: [],
          senses: entry.senses.map((sense) => ({
            definition: sense.definition,
            tags: [],
            examples: sense.examples.map((ex) => ex.en),
            quotes: [],
            synonyms: sense.synonyms,
            antonyms: sense.antonyms,
            subsenses: [],
            translations: {
              uz: sense.definitionUz,
              ru: sense.definitionRu,
            },
            exampleTranslations: sense.examples.map((ex) => ({
              original: ex.en,
              uz: ex.uz,
              ru: ex.ru,
            })),
          })),
        }),
      );

      return {
        word,
        entries: translatedEntries,
        source: { name: "OpenAI" },
        fallback: true,
      };
    } catch {
      throw new HttpException(
        `Could not find or generate definition for "${word}"`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
