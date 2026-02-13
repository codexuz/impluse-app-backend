import axios from "axios";
import type {
  IeltsTest,
  IeltsReading,
  IeltsReadingPart,
  IeltsListening,
  IeltsListeningPart,
  IeltsWriting,
  IeltsWritingTask,
  IeltsQuestion,
  IeltsSubQuestion,
  IeltsQuestionOption,
  IeltsAudio,
  CreateTestDto,
  UpdateTestDto,
  CreateReadingDto,
  UpdateReadingDto,
  CreateReadingPartDto,
  UpdateReadingPartDto,
  CreateListeningDto,
  CreateListeningPartDto,
  UpdateListeningPartDto,
  CreateWritingDto,
  CreateWritingTaskDto,
  CreateQuestionDto,
  UpdateQuestionDto,
  CreateSubQuestionDto,
  UpdateSubQuestionDto,
  CreateQuestionOptionDto,
  UpdateQuestionOptionDto,
  CreateAudioDto,
  TestQuery,
  ReadingQuery,
  ReadingPartQuery,
  ListeningQuery,
  ListeningPartQuery,
  WritingQuery,
  PaginationQuery,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== TESTS ====================

export const testsApi = {
  create: (data: CreateTestDto) =>
    api.post<IeltsTest>("/ielts-tests", data).then((r) => r.data),

  getAll: (query?: TestQuery) =>
    api
      .get<{
        data: IeltsTest[];
        total: number;
      }>("/ielts-tests", { params: query })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<IeltsTest>(`/ielts-tests/${id}`).then((r) => r.data),

  update: (id: string, data: UpdateTestDto) =>
    api.patch<IeltsTest>(`/ielts-tests/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/ielts-tests/${id}`).then((r) => r.data),
};

// ==================== READING ====================

export const readingApi = {
  create: (data: CreateReadingDto) =>
    api.post<IeltsReading>("/ielts-reading", data).then((r) => r.data),

  getAll: (query?: ReadingQuery) =>
    api
      .get<{
        data: IeltsReading[];
        total: number;
      }>("/ielts-reading", { params: query })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<IeltsReading>(`/ielts-reading/${id}`).then((r) => r.data),

  update: (id: string, data: UpdateReadingDto) =>
    api.patch<IeltsReading>(`/ielts-reading/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/ielts-reading/${id}`).then((r) => r.data),
};

// ==================== READING PARTS ====================

export const readingPartsApi = {
  create: (data: CreateReadingPartDto) =>
    api
      .post<IeltsReadingPart>("/ielts-reading-parts", data)
      .then((r) => r.data),

  getAll: (query?: ReadingPartQuery) =>
    api
      .get<{
        data: IeltsReadingPart[];
        total: number;
      }>("/ielts-reading-parts", { params: query })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<IeltsReadingPart>(`/ielts-reading-parts/${id}`).then((r) => r.data),

  update: (id: string, data: UpdateReadingPartDto) =>
    api
      .patch<IeltsReadingPart>(`/ielts-reading-parts/${id}`, data)
      .then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/ielts-reading-parts/${id}`).then((r) => r.data),
};

// ==================== LISTENING ====================

export const listeningApi = {
  create: (data: CreateListeningDto) =>
    api.post<IeltsListening>("/ielts-listening", data).then((r) => r.data),

  getAll: (query?: ListeningQuery) =>
    api
      .get<{
        data: IeltsListening[];
        total: number;
      }>("/ielts-listening", { params: query })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<IeltsListening>(`/ielts-listening/${id}`).then((r) => r.data),
};

// ==================== LISTENING PARTS ====================

export const listeningPartsApi = {
  create: (data: CreateListeningPartDto) =>
    api
      .post<IeltsListeningPart>("/ielts-listening-parts", data)
      .then((r) => r.data),

  getAll: (query?: ListeningPartQuery) =>
    api
      .get<{
        data: IeltsListeningPart[];
        total: number;
      }>("/ielts-listening-parts", { params: query })
      .then((r) => r.data),

  getById: (id: string) =>
    api
      .get<IeltsListeningPart>(`/ielts-listening-parts/${id}`)
      .then((r) => r.data),

  update: (id: string, data: UpdateListeningPartDto) =>
    api
      .patch<IeltsListeningPart>(`/ielts-listening-parts/${id}`, data)
      .then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/ielts-listening-parts/${id}`).then((r) => r.data),
};

// ==================== WRITING ====================

export const writingApi = {
  create: (data: CreateWritingDto) =>
    api.post<IeltsWriting>("/ielts-writing", data).then((r) => r.data),

  getAll: (query?: WritingQuery) =>
    api
      .get<{
        data: IeltsWriting[];
        total: number;
      }>("/ielts-writing", { params: query })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<IeltsWriting>(`/ielts-writing/${id}`).then((r) => r.data),
};

// ==================== WRITING TASKS ====================

export const writingTasksApi = {
  create: (data: CreateWritingTaskDto) =>
    api.post<IeltsWritingTask>("/ielts-writing/task", data).then((r) => r.data),

  getById: (id: string) =>
    api.get<IeltsWritingTask>(`/ielts-writing/task/${id}`).then((r) => r.data),
};

// ==================== QUESTIONS ====================

export const questionsApi = {
  create: (data: CreateQuestionDto) =>
    api.post<IeltsQuestion>("/ielts-questions", data).then((r) => r.data),

  getAll: (
    query?: PaginationQuery & {
      readingPartId?: string;
      listeningPartId?: string;
    },
  ) =>
    api
      .get<{
        data: IeltsQuestion[];
        total: number;
      }>("/ielts-questions", { params: query })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<IeltsQuestion>(`/ielts-questions/${id}`).then((r) => r.data),

  update: (id: string, data: UpdateQuestionDto) =>
    api
      .patch<IeltsQuestion>(`/ielts-questions/${id}`, data)
      .then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/ielts-questions/${id}`).then((r) => r.data),
};

// ==================== SUB-QUESTIONS ====================

export const subQuestionsApi = {
  create: (data: CreateSubQuestionDto) =>
    api
      .post<IeltsSubQuestion>("/ielts-sub-questions", data)
      .then((r) => r.data),

  getAll: (query?: PaginationQuery & { questionId?: string }) =>
    api
      .get<{
        data: IeltsSubQuestion[];
        total: number;
      }>("/ielts-sub-questions", { params: query })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<IeltsSubQuestion>(`/ielts-sub-questions/${id}`).then((r) => r.data),

  update: (id: string, data: UpdateSubQuestionDto) =>
    api
      .patch<IeltsSubQuestion>(`/ielts-sub-questions/${id}`, data)
      .then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/ielts-sub-questions/${id}`).then((r) => r.data),
};

// ==================== QUESTION OPTIONS ====================

export const questionOptionsApi = {
  create: (data: CreateQuestionOptionDto) =>
    api
      .post<IeltsQuestionOption>("/ielts-question-choices", data)
      .then((r) => r.data),

  getAll: (query?: PaginationQuery & { questionId?: string }) =>
    api
      .get<{
        data: IeltsQuestionOption[];
        total: number;
      }>("/ielts-question-choices", { params: query })
      .then((r) => r.data),

  getById: (id: string) =>
    api
      .get<IeltsQuestionOption>(`/ielts-question-choices/${id}`)
      .then((r) => r.data),

  update: (id: string, data: UpdateQuestionOptionDto) =>
    api
      .patch<IeltsQuestionOption>(`/ielts-question-choices/${id}`, data)
      .then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/ielts-question-choices/${id}`).then((r) => r.data),
};

// ==================== AUDIO ====================

export const audioApi = {
  create: (data: CreateAudioDto) =>
    api.post<IeltsAudio>("/ielts-tests/audio", data).then((r) => r.data),

  getAll: () => api.get<IeltsAudio[]>("/ielts-tests/audio").then((r) => r.data),

  getById: (id: string) =>
    api.get<IeltsAudio>(`/ielts-tests/audio/${id}`).then((r) => r.data),
};

export default api;
