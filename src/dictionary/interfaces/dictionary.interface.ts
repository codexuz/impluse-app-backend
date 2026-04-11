export interface DictionaryPronunciation {
  type: string;
  text: string;
  tags: string[];
}

export interface DictionaryForm {
  word: string;
  tags: string[];
}

export interface DictionaryQuote {
  text: string;
  reference: string;
}

export interface DictionarySense {
  definition: string;
  tags: string[];
  examples: string[];
  quotes: DictionaryQuote[];
  synonyms: string[];
  antonyms: string[];
  subsenses: DictionarySense[];
}

export interface DictionaryEntry {
  language: {
    code: string;
    name: string;
  };
  partOfSpeech: string;
  pronunciations: DictionaryPronunciation[];
  forms: DictionaryForm[];
  senses: DictionarySense[];
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryApiResponse {
  word: string;
  entries: DictionaryEntry[];
  source: {
    url: string;
    license: {
      name: string;
      url: string;
    };
  };
}

export interface TranslationResult {
  uz: string;
  ru: string;
}

export interface TranslatedSense extends DictionarySense {
  translations: TranslationResult;
  exampleTranslations?: {
    original: string;
    uz: string;
    ru: string;
  }[];
}

export interface TranslatedEntry extends Omit<DictionaryEntry, "senses"> {
  senses: TranslatedSense[];
}

export interface DictionaryResult {
  word: string;
  entries: TranslatedEntry[];
  source: DictionaryApiResponse["source"] | { name: string };
  fallback?: boolean;
}
