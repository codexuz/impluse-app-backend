/**
 * SpeechSuper coreTypes and the audio limits documented for each.
 * @see https://github.com/speechsuper/speechsuper-api-samples
 */
export const SPEECHSUPER_CORE_TYPES = {
  /** Scripted English word pronunciation. Audio limit: 20s. */
  WORD: "word.eval.promax",
  /** Scripted English sentence/phrase pronunciation. Audio limit: 90s. */
  SENTENCE: "sent.eval.promax",
  /** Scripted English paragraph pronunciation. Audio limit: 3min. */
  PARAGRAPH: "para.eval",
  /** Unscripted IELTS speaking assessment (Pro). Audio limit: 2min. */
  IELTS: "speak.eval.pro",
  /** Unscripted general-purpose speech assessment. Audio limit: ~5min. */
  GENERAL: "asr.eval",
} as const;

export type SpeechSuperCoreType =
  (typeof SPEECHSUPER_CORE_TYPES)[keyof typeof SPEECHSUPER_CORE_TYPES];

/**
 * Logical part type a question targets. Drives which coreType is used
 * and what extra request params are sent.
 */
export type SpeechSuperPartType =
  | "word"
  | "sentence"
  | "paragraph"
  | "part1"
  | "part2"
  | "part3"
  | "general";

/** Maps a part type to the SpeechSuper coreType used to assess it. */
export const PART_TYPE_TO_CORE_TYPE: Record<
  SpeechSuperPartType,
  SpeechSuperCoreType
> = {
  word: SPEECHSUPER_CORE_TYPES.WORD,
  sentence: SPEECHSUPER_CORE_TYPES.SENTENCE,
  paragraph: SPEECHSUPER_CORE_TYPES.PARAGRAPH,
  part1: SPEECHSUPER_CORE_TYPES.IELTS,
  part2: SPEECHSUPER_CORE_TYPES.IELTS,
  part3: SPEECHSUPER_CORE_TYPES.IELTS,
  general: SPEECHSUPER_CORE_TYPES.GENERAL,
};

/** IELTS task_type expected by speak.eval.pro for each IELTS part. */
export const PART_TYPE_TO_IELTS_TASK: Partial<
  Record<SpeechSuperPartType, string>
> = {
  part1: "ielts_part1",
  part2: "ielts_part2",
  part3: "ielts_part3",
};

/** Audio duration limit (seconds) per coreType, for client-side guardrails. */
export const CORE_TYPE_AUDIO_LIMIT_SECONDS: Record<SpeechSuperCoreType, number> =
  {
    [SPEECHSUPER_CORE_TYPES.WORD]: 20,
    [SPEECHSUPER_CORE_TYPES.SENTENCE]: 90,
    [SPEECHSUPER_CORE_TYPES.PARAGRAPH]: 180,
    [SPEECHSUPER_CORE_TYPES.IELTS]: 120,
    [SPEECHSUPER_CORE_TYPES.GENERAL]: 290,
  };

/** Whether a coreType requires refText (scripted) or not (unscripted). */
export const CORE_TYPE_IS_SCRIPTED: Record<SpeechSuperCoreType, boolean> = {
  [SPEECHSUPER_CORE_TYPES.WORD]: true,
  [SPEECHSUPER_CORE_TYPES.SENTENCE]: true,
  [SPEECHSUPER_CORE_TYPES.PARAGRAPH]: true,
  [SPEECHSUPER_CORE_TYPES.IELTS]: false,
  [SPEECHSUPER_CORE_TYPES.GENERAL]: false,
};
