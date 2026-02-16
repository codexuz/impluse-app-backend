import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import {
  IeltsAnswerAttempt,
  AttemptScope,
  AttemptStatus,
} from "./entities/ielts-answer-attempt.entity.js";
import { IeltsReadingAnswer } from "./entities/ielts-reading-answer.entity.js";
import { IeltsListeningAnswer } from "./entities/ielts-listening-answer.entity.js";
import { IeltsWritingAnswer } from "./entities/ielts-writing-answer.entity.js";
import { IeltsReadingPart } from "./entities/ielts-reading-part.entity.js";
import { IeltsListeningPart } from "./entities/ielts-listening-part.entity.js";
import { IeltsWritingTask } from "./entities/ielts-writing-task.entity.js";
import { IeltsQuestion } from "./entities/ielts-question.entity.js";
import { IeltsQuestionOption } from "./entities/ielts-question-option.entity.js";
import { IeltsSubQuestion } from "./entities/ielts-multiple-choice-question.entity.js";
import { IeltsTest } from "./entities/ielts-test.entity.js";
import { User } from "../users/entities/user.entity.js";
import {
  CreateAttemptDto,
  SaveReadingAnswersDto,
  SaveListeningAnswersDto,
  SaveWritingAnswersDto,
  AttemptQueryDto,
} from "./dto/ielts-answers.dto.js";

@Injectable()
export class IeltsAnswersService {
  constructor(
    @InjectModel(IeltsAnswerAttempt)
    private readonly attemptModel: typeof IeltsAnswerAttempt,
    @InjectModel(IeltsReadingAnswer)
    private readonly readingAnswerModel: typeof IeltsReadingAnswer,
    @InjectModel(IeltsListeningAnswer)
    private readonly listeningAnswerModel: typeof IeltsListeningAnswer,
    @InjectModel(IeltsWritingAnswer)
    private readonly writingAnswerModel: typeof IeltsWritingAnswer,
    @InjectModel(IeltsQuestionOption)
    private readonly questionOptionModel: typeof IeltsQuestionOption,
    @InjectModel(IeltsSubQuestion)
    private readonly subQuestionModel: typeof IeltsSubQuestion,
  ) {}

  // ========== Attempts ==========

  async createAttempt(userId: string, dto: CreateAttemptDto) {
    return await this.attemptModel.create({
      user_id: userId,
      scope: dto.scope,
      test_id: dto.test_id || null,
      module_id: dto.module_id || null,
      part_id: dto.part_id || null,
      task_id: dto.task_id || null,
      started_at: new Date(),
      status: AttemptStatus.IN_PROGRESS,
    } as any);
  }

  async findAllAttempts(userId: string, query: AttemptQueryDto) {
    const { page = 1, limit = 10, test_id, scope, status } = query;
    const where: any = { user_id: userId };

    if (test_id) where.test_id = test_id;
    if (scope) where.scope = scope;
    if (status) where.status = status;

    const { rows, count } = await this.attemptModel.findAndCountAll({
      where,
      include: [{ model: IeltsTest, as: "test" }],
      order: [["createdAt", "DESC"]],
      limit,
      offset: (page - 1) * limit,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findAttemptById(attemptId: string, userId: string) {
    const attempt = await this.attemptModel.findOne({
      where: { id: attemptId, user_id: userId },
      include: [
        { model: IeltsTest, as: "test" },
        { model: IeltsReadingAnswer, as: "readingAnswers" },
        { model: IeltsListeningAnswer, as: "listeningAnswers" },
        { model: IeltsWritingAnswer, as: "writingAnswers" },
      ],
    });

    if (!attempt) {
      throw new NotFoundException("Attempt not found");
    }

    return attempt;
  }

  async submitAttempt(attemptId: string, userId: string) {
    const attempt = await this.attemptModel.findOne({
      where: { id: attemptId, user_id: userId },
    });

    if (!attempt) {
      throw new NotFoundException("Attempt not found");
    }

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestException(
        `Attempt is already ${attempt.status.toLowerCase()}`,
      );
    }

    attempt.status = AttemptStatus.SUBMITTED;
    attempt.finished_at = new Date();
    await attempt.save();

    return attempt;
  }

  async abandonAttempt(attemptId: string, userId: string) {
    const attempt = await this.attemptModel.findOne({
      where: { id: attemptId, user_id: userId },
    });

    if (!attempt) {
      throw new NotFoundException("Attempt not found");
    }

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestException(
        `Attempt is already ${attempt.status.toLowerCase()}`,
      );
    }

    attempt.status = AttemptStatus.ABANDONED;
    attempt.finished_at = new Date();
    await attempt.save();

    return attempt;
  }

  // ========== Reading Answers ==========

  async saveReadingAnswers(userId: string, dto: SaveReadingAnswersDto) {
    const attempt = await this.validateAttempt(dto.attempt_id, userId);

    // Fetch correct answers for all questions in this batch
    const questionIds = [...new Set(dto.answers.map((a) => a.question_id))];
    const correctAnswersMap = await this.buildCorrectAnswersMap(questionIds);

    const answersData = dto.answers.map((answer) => {
      const correctAnswer = correctAnswersMap.get(answer.question_id);
      const isCorrect = correctAnswer
        ? this.checkAnswer(answer.answer, correctAnswer, answer.question_number)
        : null;

      return {
        attempt_id: dto.attempt_id,
        user_id: userId,
        part_id: answer.part_id,
        question_id: answer.question_id,
        question_number: answer.question_number || null,
        answer: answer.answer,
        is_correct: isCorrect,
        correct_answer: correctAnswer
          ? this.getCorrectAnswerText(correctAnswer, answer.question_number)
          : null,
      };
    });

    // Upsert: delete existing answers for this attempt + part combo, then bulk create
    const partIds = [...new Set(dto.answers.map((a) => a.part_id))];
    await this.readingAnswerModel.destroy({
      where: {
        attempt_id: dto.attempt_id,
        user_id: userId,
        part_id: partIds,
      },
    });

    const saved = await this.readingAnswerModel.bulkCreate(
      answersData as any[],
    );

    const correctCount = saved.filter((a: any) => a.is_correct === true).length;

    return {
      message: "Reading answers saved successfully",
      count: saved.length,
      correctCount,
      incorrectCount: saved.length - correctCount,
    };
  }

  async getReadingAnswers(attemptId: string, userId: string) {
    const attempt = await this.attemptModel.findOne({
      where: { id: attemptId, user_id: userId },
    });

    if (!attempt) {
      throw new NotFoundException("Attempt not found");
    }

    const answers = await this.readingAnswerModel.findAll({
      where: { attempt_id: attemptId, user_id: userId },
      include: [
        { model: IeltsReadingPart, as: "readingPart" },
        { model: IeltsQuestion, as: "question" },
      ],
      order: [["question_number", "ASC"]],
    });

    const total = answers.length;
    const correctCount = answers.filter(
      (a: any) => a.is_correct === true,
    ).length;

    return {
      data: answers,
      total,
      correctCount,
      incorrectCount: total - correctCount,
      score: total > 0 ? Math.round((correctCount / total) * 100) : 0,
    };
  }

  // ========== Listening Answers ==========

  async saveListeningAnswers(userId: string, dto: SaveListeningAnswersDto) {
    const attempt = await this.validateAttempt(dto.attempt_id, userId);

    // Fetch correct answers for all questions in this batch
    const questionIds = [...new Set(dto.answers.map((a) => a.question_id))];
    const correctAnswersMap = await this.buildCorrectAnswersMap(questionIds);

    const answersData = dto.answers.map((answer) => {
      const correctAnswer = correctAnswersMap.get(answer.question_id);
      const isCorrect = correctAnswer
        ? this.checkAnswer(answer.answer, correctAnswer, answer.question_number)
        : null;

      return {
        attempt_id: dto.attempt_id,
        user_id: userId,
        part_id: answer.part_id,
        question_id: answer.question_id,
        question_number: answer.question_number || null,
        answer: answer.answer,
        is_correct: isCorrect,
        correct_answer: correctAnswer
          ? this.getCorrectAnswerText(correctAnswer, answer.question_number)
          : null,
      };
    });

    const partIds = [...new Set(dto.answers.map((a) => a.part_id))];
    await this.listeningAnswerModel.destroy({
      where: {
        attempt_id: dto.attempt_id,
        user_id: userId,
        part_id: partIds,
      },
    });

    const saved = await this.listeningAnswerModel.bulkCreate(
      answersData as any[],
    );

    const correctCount = saved.filter((a: any) => a.is_correct === true).length;

    return {
      message: "Listening answers saved successfully",
      count: saved.length,
      correctCount,
      incorrectCount: saved.length - correctCount,
    };
  }

  async getListeningAnswers(attemptId: string, userId: string) {
    const attempt = await this.attemptModel.findOne({
      where: { id: attemptId, user_id: userId },
    });

    if (!attempt) {
      throw new NotFoundException("Attempt not found");
    }

    const answers = await this.listeningAnswerModel.findAll({
      where: { attempt_id: attemptId, user_id: userId },
      include: [
        { model: IeltsListeningPart, as: "listeningPart" },
        { model: IeltsQuestion, as: "question" },
      ],
      order: [["question_number", "ASC"]],
    });

    const total = answers.length;
    const correctCount = answers.filter(
      (a: any) => a.is_correct === true,
    ).length;

    return {
      data: answers,
      total,
      correctCount,
      incorrectCount: total - correctCount,
      score: total > 0 ? Math.round((correctCount / total) * 100) : 0,
    };
  }

  // ========== Writing Answers ==========

  async saveWritingAnswers(userId: string, dto: SaveWritingAnswersDto) {
    const attempt = await this.validateAttempt(dto.attempt_id, userId);

    const answersData = dto.answers.map((answer) => ({
      attempt_id: dto.attempt_id,
      user_id: userId,
      task_id: answer.task_id,
      answer_text: answer.answer_text,
      word_count: answer.word_count || null,
    }));

    const taskIds = [...new Set(dto.answers.map((a) => a.task_id))];
    await this.writingAnswerModel.destroy({
      where: {
        attempt_id: dto.attempt_id,
        user_id: userId,
        task_id: taskIds,
      },
    });

    const saved = await this.writingAnswerModel.bulkCreate(
      answersData as any[],
    );

    return {
      message: "Writing answers saved successfully",
      count: saved.length,
    };
  }

  async getWritingAnswers(attemptId: string, userId: string) {
    await this.validateAttempt(attemptId, userId);

    return await this.writingAnswerModel.findAll({
      where: { attempt_id: attemptId, user_id: userId },
      include: [{ model: IeltsWritingTask, as: "task" }],
    });
  }

  // ========== Helpers ==========

  /**
   * Build a map of question_id -> { options, subQuestions } for answer checking
   */
  private async buildCorrectAnswersMap(
    questionIds: string[],
  ): Promise<
    Map<
      string,
      { options: IeltsQuestionOption[]; subQuestions: IeltsSubQuestion[] }
    >
  > {
    const questions = await IeltsQuestion.findAll({
      where: { id: questionIds },
      include: [
        { model: IeltsSubQuestion, as: "questions" },
        { model: IeltsQuestionOption, as: "options" },
      ],
    });

    const map = new Map<
      string,
      { options: IeltsQuestionOption[]; subQuestions: IeltsSubQuestion[] }
    >();

    for (const q of questions) {
      map.set(q.id, {
        options: (q as any).options || [],
        subQuestions: (q as any).questions || [],
      });
    }

    return map;
  }

  /**
   * Check if the user's answer is correct
   */
  private checkAnswer(
    userAnswer: string,
    correctData: {
      options: IeltsQuestionOption[];
      subQuestions: IeltsSubQuestion[];
    },
    questionNumber?: string,
  ): boolean {
    if (!userAnswer) return false;

    const normalized = userAnswer.trim().toLowerCase();

    // If sub-questions exist, match by question number
    if (correctData.subQuestions.length > 0) {
      const sub = questionNumber
        ? correctData.subQuestions.find(
            (sq) => String(sq.questionNumber) === String(questionNumber),
          )
        : correctData.subQuestions[0];

      if (sub?.correctAnswer) {
        return normalized === sub.correctAnswer.trim().toLowerCase();
      }
    }

    // If options exist, check against the correct option
    if (correctData.options.length > 0) {
      const correctOption = correctData.options.find((o) => o.isCorrect);
      if (correctOption) {
        return (
          normalized === correctOption.optionKey?.trim().toLowerCase() ||
          normalized === correctOption.optionText?.trim().toLowerCase()
        );
      }
    }

    return false;
  }

  /**
   * Get the correct answer text for storage
   */
  private getCorrectAnswerText(
    correctData: {
      options: IeltsQuestionOption[];
      subQuestions: IeltsSubQuestion[];
    },
    questionNumber?: string,
  ): string | null {
    if (correctData.subQuestions.length > 0) {
      const sub = questionNumber
        ? correctData.subQuestions.find(
            (sq) => String(sq.questionNumber) === String(questionNumber),
          )
        : correctData.subQuestions[0];

      if (sub?.correctAnswer) return sub.correctAnswer;
    }

    if (correctData.options.length > 0) {
      const correctOption = correctData.options.find((o) => o.isCorrect);
      if (correctOption) {
        return correctOption.optionKey
          ? `${correctOption.optionKey}: ${correctOption.optionText}`
          : correctOption.optionText;
      }
    }

    return null;
  }

  private async validateAttempt(
    attemptId: string,
    userId: string,
  ): Promise<IeltsAnswerAttempt> {
    const attempt = await this.attemptModel.findOne({
      where: { id: attemptId, user_id: userId },
    });

    if (!attempt) {
      throw new NotFoundException("Attempt not found");
    }

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestException(
        `Cannot modify answers for an attempt that is ${attempt.status.toLowerCase()}`,
      );
    }

    return attempt;
  }
}
