// ==================== ENUMS (as const objects for erasableSyntaxOnly) ====================

export const QuestionType = {
  NOTE_COMPLETION: "NOTE_COMPLETION",
  TRUE_FALSE_NOT_GIVEN: "TRUE_FALSE_NOT_GIVEN",
  YES_NO_NOT_GIVEN: "YES_NO_NOT_GIVEN",
  MATCHING_INFORMATION: "MATCHING_INFORMATION",
  MATCHING_HEADINGS: "MATCHING_HEADINGS",
  SUMMARY_COMPLETION: "SUMMARY_COMPLETION",
  SUMMARY_COMPLETION_DRAG_DROP: "SUMMARY_COMPLETION_DRAG_DROP",
  MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
  SENTENCE_COMPLETION: "SENTENCE_COMPLETION",
  SHORT_ANSWER: "SHORT_ANSWER",
  TABLE_COMPLETION: "TABLE_COMPLETION",
  FLOW_CHART_COMPLETION: "FLOW_CHART_COMPLETION",
  DIAGRAM_LABELLING: "DIAGRAM_LABELLING",
  MATCHING_FEATURES: "MATCHING_FEATURES",
  MATCHING_SENTENCE_ENDINGS: "MATCHING_SENTENCE_ENDINGS",
  PLAN_MAP_LABELLING: "PLAN_MAP_LABELLING",
  MULTIPLE_ANSWER: "MULTIPLE_ANSWER",
} as const;
export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

export const ReadingPart = {
  PART_1: "PART_1",
  PART_2: "PART_2",
  PART_3: "PART_3",
} as const;
export type ReadingPart = (typeof ReadingPart)[keyof typeof ReadingPart];

export const ListeningPart = {
  PART_1: "PART_1",
  PART_2: "PART_2",
  PART_3: "PART_3",
  PART_4: "PART_4",
} as const;
export type ListeningPart = (typeof ListeningPart)[keyof typeof ListeningPart];

export const WritingTask = {
  TASK_1: "TASK_1",
  TASK_2: "TASK_2",
} as const;
export type WritingTask = (typeof WritingTask)[keyof typeof WritingTask];

export const DifficultyLevel = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
} as const;
export type DifficultyLevel =
  (typeof DifficultyLevel)[keyof typeof DifficultyLevel];

export const TestMode = {
  PRACTICE: "practice",
  MOCK: "mock",
} as const;
export type TestMode = (typeof TestMode)[keyof typeof TestMode];

export const TestStatus = {
  DRAFT: "draft",
  PUBLISHED: "published",
} as const;
export type TestStatus = (typeof TestStatus)[keyof typeof TestStatus];

export const TestCategory = {
  AUTHENTIC: "authentic",
  PRE_TEST: "pre-test",
  CAMBRIDGE_BOOKS: "cambridge books",
} as const;
export type TestCategory = (typeof TestCategory)[keyof typeof TestCategory];

// ==================== ENTITIES ====================

export interface IeltsTest {
  id: string;
  title: string;
  mode: TestMode;
  status: TestStatus;
  category?: TestCategory;
  created_by: string;
  createdAt: string;
  updatedAt: string;
  readings?: IeltsReading[];
  listenings?: IeltsListening[];
  writings?: IeltsWriting[];
}

export interface IeltsReading {
  id: string;
  title: string;
  test_id: string;
  createdAt: string;
  updatedAt: string;
  parts?: IeltsReadingPart[];
  test?: IeltsTest;
}

export interface IeltsReadingPart {
  id: string;
  reading_id?: string;
  part: ReadingPart;
  title?: string;
  content?: string;
  timeLimitMinutes?: number;
  difficulty?: DifficultyLevel;
  isActive?: boolean;
  totalQuestions?: number;
  createdAt: string;
  updatedAt: string;
  questions?: IeltsQuestion[];
  reading?: IeltsReading;
}

export interface IeltsListening {
  id: string;
  title: string;
  description?: string;
  test_id?: string;
  full_audio_url?: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  parts?: IeltsListeningPart[];
  test?: IeltsTest;
}

export interface IeltsListeningPart {
  id: string;
  listening_id?: string;
  part: ListeningPart;
  title?: string;
  audio_id?: string;
  timeLimitMinutes?: number;
  difficulty?: DifficultyLevel;
  isActive?: boolean;
  totalQuestions?: number;
  createdAt: string;
  updatedAt: string;
  questions?: IeltsQuestion[];
  audio?: IeltsAudio;
  listening?: IeltsListening;
}

export interface IeltsWriting {
  id: string;
  title?: string;
  description?: string;
  test_id?: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  tasks?: IeltsWritingTask[];
  test?: IeltsTest;
}

export interface IeltsWritingTask {
  id: string;
  writing_id: string;
  task: WritingTask;
  prompt?: string;
  image_url?: string;
  min_words?: number;
  suggested_time?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IeltsQuestion {
  id: string;
  reading_part_id?: string;
  listening_part_id?: string;
  questionNumber?: number;
  type?: QuestionType;
  questionText?: string;
  instruction?: string;
  context?: string;
  headingOptions?: unknown;
  tableData?: unknown;
  points?: number;
  isActive?: boolean;
  explanation?: string;
  fromPassage?: string;
  createdAt: string;
  updatedAt: string;
  subQuestions?: IeltsSubQuestion[];
  options?: IeltsQuestionOption[];
}

export interface IeltsSubQuestion {
  id: string;
  question_id: string;
  questionNumber?: number;
  questionText?: string;
  points?: number;
  correctAnswer?: string;
  explanation?: string;
  fromPassage?: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IeltsQuestionOption {
  id: string;
  question_id: string;
  optionKey?: string;
  optionText?: string;
  isCorrect?: boolean;
  orderIndex?: number;
  explanation?: string;
  fromPassage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IeltsAudio {
  id: string;
  url: string;
  file_name?: string;
  duration?: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== DTOs ====================

export interface CreateTestDto {
  title: string;
  mode: TestMode;
  status?: TestStatus;
  category?: TestCategory;
}

export type UpdateTestDto = Partial<CreateTestDto>;

export interface CreateReadingDto {
  title: string;
  test_id: string;
}

export type UpdateReadingDto = Partial<CreateReadingDto>;

export interface CreateReadingPartDto {
  reading_id: string;
  part: ReadingPart;
  title?: string;
  content?: string;
  timeLimitMinutes?: number;
  difficulty?: DifficultyLevel;
  isActive?: boolean;
  totalQuestions?: number;
  questions?: CreateReadingPartQuestionDto[];
}

export interface CreateReadingPartQuestionDto {
  questionNumber?: number;
  type?: QuestionType;
  questionText?: string;
  instruction?: string;
  context?: string;
  headingOptions?: unknown;
  tableData?: unknown;
  points?: number;
  isActive?: boolean;
  explanation?: string;
  fromPassage?: string;
  questions?: CreateSubQuestionDto[];
  options?: CreateQuestionOptionDto[];
}

export type UpdateReadingPartDto = Partial<CreateReadingPartDto>;

export interface CreateListeningDto {
  title: string;
  description?: string;
  test_id?: string;
  full_audio_url?: string;
  is_active?: boolean;
}

export interface CreateListeningPartDto {
  listening_id: string;
  part: ListeningPart;
  title?: string;
  audio_id?: string;
  audio?: CreateAudioDto;
  timeLimitMinutes?: number;
  difficulty?: DifficultyLevel;
  isActive?: boolean;
  totalQuestions?: number;
  questions?: CreateListeningPartQuestionDto[];
}

export interface CreateListeningPartQuestionDto {
  questionNumber?: number;
  type?: QuestionType;
  questionText?: string;
  instruction?: string;
  context?: string;
  headingOptions?: unknown;
  tableData?: unknown;
  points?: number;
  isActive?: boolean;
  explanation?: string;
  fromPassage?: string;
  questions?: CreateSubQuestionDto[];
  options?: CreateQuestionOptionDto[];
}

export type UpdateListeningPartDto = Partial<CreateListeningPartDto>;

export interface CreateWritingDto {
  title?: string;
  description?: string;
  test_id?: string;
  is_active?: boolean;
}

export type UpdateWritingDto = Partial<CreateWritingDto>;

export interface CreateWritingTaskDto {
  writing_id: string;
  task: WritingTask;
  prompt?: string;
  image_url?: string;
  min_words?: number;
  suggested_time?: number;
}

export type UpdateWritingTaskDto = Partial<CreateWritingTaskDto>;

export interface CreateQuestionDto {
  reading_part_id?: string;
  listening_part_id?: string;
  questionNumber?: number;
  type?: QuestionType;
  questionText?: string;
  instruction?: string;
  context?: string;
  headingOptions?: unknown;
  tableData?: unknown;
  points?: number;
  isActive?: boolean;
  explanation?: string;
  fromPassage?: string;
}

export type UpdateQuestionDto = Partial<CreateQuestionDto>;

export interface CreateSubQuestionDto {
  question_id?: string;
  questionNumber?: number;
  questionText?: string;
  points?: number;
  correctAnswer?: string;
  explanation?: string;
  fromPassage?: string;
  order?: number;
}

export type UpdateSubQuestionDto = Partial<CreateSubQuestionDto>;

export interface CreateQuestionOptionDto {
  question_id?: string;
  optionKey?: string;
  optionText?: string;
  isCorrect?: boolean;
  orderIndex?: number;
  explanation?: string;
  fromPassage?: string;
}

export type UpdateQuestionOptionDto = Partial<CreateQuestionOptionDto>;

export interface CreateAudioDto {
  url: string;
  file_name?: string;
  duration?: number;
}

// ==================== QUERY DTOs ====================

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface TestQuery extends PaginationQuery {
  mode?: TestMode;
  status?: TestStatus;
  category?: TestCategory;
}

export interface ReadingQuery extends PaginationQuery {
  testId?: string;
}

export interface ReadingPartQuery extends PaginationQuery {
  readingId?: string;
  part?: ReadingPart;
}

export interface ListeningQuery extends PaginationQuery {
  testId?: string;
  isActive?: boolean;
}

export interface ListeningPartQuery extends PaginationQuery {
  listeningId?: string;
  part?: ListeningPart;
}

export interface WritingQuery extends PaginationQuery {
  testId?: string;
  isActive?: boolean;
}

export interface WritingTaskQuery extends PaginationQuery {
  writingId?: string;
  task?: WritingTask;
}

// ==================== API RESPONSE ====================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  [QuestionType.NOTE_COMPLETION]: "Note Completion",
  [QuestionType.TRUE_FALSE_NOT_GIVEN]: "True / False / Not Given",
  [QuestionType.YES_NO_NOT_GIVEN]: "Yes / No / Not Given",
  [QuestionType.MATCHING_INFORMATION]: "Matching Information",
  [QuestionType.MATCHING_HEADINGS]: "Matching Headings",
  [QuestionType.SUMMARY_COMPLETION]: "Summary Completion",
  [QuestionType.SUMMARY_COMPLETION_DRAG_DROP]:
    "Summary Completion (Drag & Drop)",
  [QuestionType.MULTIPLE_CHOICE]: "Multiple Choice",
  [QuestionType.SENTENCE_COMPLETION]: "Sentence Completion",
  [QuestionType.SHORT_ANSWER]: "Short Answer",
  [QuestionType.TABLE_COMPLETION]: "Table Completion",
  [QuestionType.FLOW_CHART_COMPLETION]: "Flow Chart Completion",
  [QuestionType.DIAGRAM_LABELLING]: "Diagram Labelling",
  [QuestionType.MATCHING_FEATURES]: "Matching Features",
  [QuestionType.MATCHING_SENTENCE_ENDINGS]: "Matching Sentence Endings",
  [QuestionType.PLAN_MAP_LABELLING]: "Plan / Map Labelling",
  [QuestionType.MULTIPLE_ANSWER]: "Multiple Answer",
};
