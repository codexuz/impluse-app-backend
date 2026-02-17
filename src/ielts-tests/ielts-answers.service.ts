import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import {
  IeltsAnswerAttempt,
  AttemptScope,
  AttemptStatus,
} from "./entities/ielts-answer-attempt.entity.js";
import { IeltsReadingAnswer } from "./entities/ielts-reading-answer.entity.js";
import { IeltsListeningAnswer } from "./entities/ielts-listening-answer.entity.js";
import { IeltsWritingAnswer } from "./entities/ielts-writing-answer.entity.js";
import { IeltsReading } from "./entities/ielts-reading.entity.js";
import { IeltsReadingPart } from "./entities/ielts-reading-part.entity.js";
import { IeltsListening } from "./entities/ielts-listening.entity.js";
import { IeltsListeningPart } from "./entities/ielts-listening-part.entity.js";
import { IeltsWritingTask } from "./entities/ielts-writing-task.entity.js";
import { IeltsQuestion } from "./entities/ielts-question.entity.js";
import { IeltsSubQuestion } from "./entities/ielts-multiple-choice-question.entity.js";
import { IeltsQuestionOption } from "./entities/ielts-question-option.entity.js";
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
    @InjectModel(IeltsQuestion)
    private readonly questionModel: typeof IeltsQuestion,
    @InjectModel(IeltsSubQuestion)
    private readonly subQuestionModel: typeof IeltsSubQuestion,
    @InjectModel(IeltsQuestionOption)
    private readonly questionOptionModel: typeof IeltsQuestionOption,
    @InjectModel(IeltsReading)
    private readonly readingModel: typeof IeltsReading,
    @InjectModel(IeltsReadingPart)
    private readonly readingPartModel: typeof IeltsReadingPart,
    @InjectModel(IeltsListening)
    private readonly listeningModel: typeof IeltsListening,
    @InjectModel(IeltsListeningPart)
    private readonly listeningPartModel: typeof IeltsListeningPart,
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

    // Collect all question_ids from answers
    const allAnswers = [
      ...((attempt as any).readingAnswers || []),
      ...((attempt as any).listeningAnswers || []),
    ];
    const questionIds = [...new Set(allAnswers.map((a: any) => a.question_id))];

    // Load questions with sub-questions and options
    const questions = await this.questionModel.findAll({
      where: { id: questionIds },
      include: [
        { model: IeltsSubQuestion, as: "questions" },
        { model: IeltsQuestionOption, as: "options" },
      ],
    });
    const questionMap = new Map(questions.map((q) => [q.id, q]));

    // Some question_ids may actually be sub-question IDs
    const foundIds = new Set(questions.map((q) => q.id));
    const missingIds = questionIds.filter((id) => !foundIds.has(id));

    const subQuestionDirectMap = new Map<string, any>();
    if (missingIds.length > 0) {
      const directSubQuestions = await this.subQuestionModel.findAll({
        where: { id: missingIds },
      });

      // Load parent questions to get the question type
      const parentIds = [
        ...new Set(directSubQuestions.map((sq) => (sq as any).question_id)),
      ];
      const parentQuestions =
        parentIds.length > 0
          ? await this.questionModel.findAll({ where: { id: parentIds } })
          : [];
      const parentMap = new Map(parentQuestions.map((q) => [q.id, q]));

      for (const sq of directSubQuestions) {
        const plain = (sq as any).get({ plain: true });
        const parent = parentMap.get(plain.question_id);
        plain.parentQuestion = parent
          ? (parent as any).get({ plain: true })
          : null;
        subQuestionDirectMap.set(plain.id, plain);
      }
    }

    // Load ALL questions for this attempt's scope (to include unanswered ones)
    const allScopeQuestions = await this.loadAllQuestionsForAttempt(attempt);

    return this.buildAttemptResults(
      attempt,
      questionMap,
      subQuestionDirectMap,
      allScopeQuestions,
    );
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

    const answersData = dto.answers.map((answer) => ({
      attempt_id: dto.attempt_id,
      user_id: userId,
      part_id: answer.part_id,
      question_id: answer.question_id,
      question_number: answer.question_number || null,
      answer: answer.answer,
    }));

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

    return {
      message: "Reading answers saved successfully",
      count: saved.length,
    };
  }

  async getReadingAnswers(attemptId: string, userId: string) {
    await this.validateAttempt(attemptId, userId);

    return await this.readingAnswerModel.findAll({
      where: { attempt_id: attemptId, user_id: userId },
      include: [
        { model: IeltsReadingPart, as: "readingPart" },
        { model: IeltsQuestion, as: "question" },
      ],
      order: [["question_number", "ASC"]],
    });
  }

  // ========== Listening Answers ==========

  async saveListeningAnswers(userId: string, dto: SaveListeningAnswersDto) {
    const attempt = await this.validateAttempt(dto.attempt_id, userId);

    const answersData = dto.answers.map((answer) => ({
      attempt_id: dto.attempt_id,
      user_id: userId,
      part_id: answer.part_id,
      question_id: answer.question_id,
      question_number: answer.question_number || null,
      answer: answer.answer,
    }));

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

    return {
      message: "Listening answers saved successfully",
      count: saved.length,
    };
  }

  async getListeningAnswers(attemptId: string, userId: string) {
    await this.validateAttempt(attemptId, userId);

    return await this.listeningAnswerModel.findAll({
      where: { attempt_id: attemptId, user_id: userId },
      include: [
        { model: IeltsListeningPart, as: "listeningPart" },
        { model: IeltsQuestion, as: "question" },
      ],
      order: [["question_number", "ASC"]],
    });
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
   * Load ALL questions belonging to the attempt's scope (test/module/part).
   */
  private async loadAllQuestionsForAttempt(attempt: any): Promise<any[]> {
    const whereConditions: any[] = [];

    if (attempt.part_id) {
      // Scope is PART — part_id could be reading or listening part
      whereConditions.push({ reading_part_id: attempt.part_id });
      whereConditions.push({ listening_part_id: attempt.part_id });
    } else if (attempt.module_id) {
      // Scope is MODULE — module_id could be a reading or listening module
      const readingParts = await this.readingPartModel.findAll({
        where: { reading_id: attempt.module_id },
        attributes: ["id"],
      });
      const listeningParts = await this.listeningPartModel.findAll({
        where: { listening_id: attempt.module_id },
        attributes: ["id"],
      });

      const rPartIds = readingParts.map((p: any) => p.id);
      const lPartIds = listeningParts.map((p: any) => p.id);

      if (rPartIds.length > 0)
        whereConditions.push({ reading_part_id: { [Op.in]: rPartIds } });
      if (lPartIds.length > 0)
        whereConditions.push({ listening_part_id: { [Op.in]: lPartIds } });
    } else if (attempt.test_id) {
      // Scope is TEST — find all reading & listening modules, then parts
      const readings = await this.readingModel.findAll({
        where: { test_id: attempt.test_id },
        attributes: ["id"],
      });
      const listenings = await this.listeningModel.findAll({
        where: { test_id: attempt.test_id },
        attributes: ["id"],
      });

      const readingIds = readings.map((r: any) => r.id);
      const listeningIds = listenings.map((l: any) => l.id);

      if (readingIds.length > 0) {
        const rParts = await this.readingPartModel.findAll({
          where: { reading_id: { [Op.in]: readingIds } },
          attributes: ["id"],
        });
        const rPartIds = rParts.map((p: any) => p.id);
        if (rPartIds.length > 0)
          whereConditions.push({ reading_part_id: { [Op.in]: rPartIds } });
      }

      if (listeningIds.length > 0) {
        const lParts = await this.listeningPartModel.findAll({
          where: { listening_id: { [Op.in]: listeningIds } },
          attributes: ["id"],
        });
        const lPartIds = lParts.map((p: any) => p.id);
        if (lPartIds.length > 0)
          whereConditions.push({ listening_part_id: { [Op.in]: lPartIds } });
      }
    }

    if (whereConditions.length === 0) return [];

    return await this.questionModel.findAll({
      where: { [Op.or]: whereConditions },
      include: [
        { model: IeltsSubQuestion, as: "questions" },
        { model: IeltsQuestionOption, as: "options" },
      ],
      order: [["questionNumber", "ASC"]],
    });
  }

  private buildAttemptResults(
    attempt: any,
    questionMap: Map<string, any>,
    subQuestionDirectMap: Map<string, any>,
    allScopeQuestions: any[] = [],
  ) {
    const readingAnswers = attempt.readingAnswers || [];
    const listeningAnswers = attempt.listeningAnswers || [];
    const writingAnswers = attempt.writingAnswers || [];

    const readingResults = this.gradeAnswers(
      readingAnswers,
      questionMap,
      subQuestionDirectMap,
    );
    const listeningResults = this.gradeAnswers(
      listeningAnswers,
      questionMap,
      subQuestionDirectMap,
    );

    const answeredResults = [...readingResults, ...listeningResults];

    // Build set of answered question numbers to detect unanswered questions
    const answeredQuestionNumbers = new Set(
      answeredResults.map((r) => r.questionNumber),
    );

    // Enumerate all answerable items from scope questions and add unanswered ones
    const unansweredResults = this.buildUnansweredResults(
      allScopeQuestions,
      answeredQuestionNumbers,
    );

    const allResults = [...answeredResults, ...unansweredResults];
    const totalQuestions = allResults.length;
    const correctAnswers = answeredResults.filter((r) => r.isCorrect).length;
    const totalPoints = allResults.reduce((sum, r) => sum + r.points, 0);
    const earnedPoints = answeredResults.reduce(
      (sum, r) => sum + r.earnedPoints,
      0,
    );
    const score =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    const timeSpentMinutes =
      attempt.started_at && attempt.finished_at
        ? (new Date(attempt.finished_at).getTime() -
            new Date(attempt.started_at).getTime()) /
          60000
        : 0;

    return {
      attemptId: attempt.id,
      readingId: attempt.module_id,
      userId: attempt.user_id,
      totalQuestions,
      correctAnswers,
      totalPoints,
      earnedPoints,
      score,
      ieltsBandScore: this.calculateBandScore(correctAnswers, totalQuestions),
      timeSpentMinutes: Math.round(timeSpentMinutes * 100) / 100,
      isCompleted: attempt.status === AttemptStatus.SUBMITTED,
      startedAt: attempt.started_at,
      completedAt: attempt.finished_at,
      questionResults: allResults.sort(
        (a, b) => a.questionNumber - b.questionNumber,
      ),
      writingAnswers: writingAnswers.map((w: any) => ({
        taskId: w.task_id,
        answerText: w.answer_text,
        wordCount: w.word_count,
      })),
    };
  }

  private gradeAnswers(
    answers: any[],
    questionMap: Map<string, any>,
    subQuestionDirectMap: Map<string, any>,
  ): any[] {
    return answers.map((answer) => {
      const questionNumber = parseInt(answer.question_number, 10);
      const questionId = answer.question_id;

      // Case 1: question_id points directly to ielts_sub_questions
      const directSubQ = subQuestionDirectMap.get(questionId);
      if (directSubQ) {
        const parentQ = directSubQ.parentQuestion;
        const correctAnswer = directSubQ.correctAnswer || null;
        const userAnswer = (answer.answer || "").trim();
        const isCorrect = correctAnswer
          ? this.compareAnswers(userAnswer, correctAnswer)
          : null;
        const points = directSubQ.points ? Number(directSubQ.points) : 1;

        return {
          questionId,
          questionNumber,
          questionType: parentQ?.type || null,
          questionText:
            directSubQ.questionText || parentQ?.questionText || null,
          userAnswer: answer.answer,
          correctAnswer,
          isCorrect,
          points,
          earnedPoints: isCorrect ? points : 0,
          explanation: directSubQ.explanation || parentQ?.explanation || null,
          fromPassage: directSubQ.fromPassage || parentQ?.fromPassage || null,
          questionParts: [],
          answerText: null,
          optionText: null,
        };
      }

      // Case 2: question_id points to ielts_questions (parent)
      const question = questionMap.get(questionId);
      if (!question) {
        return this.buildUngradedResult(answer);
      }

      const qPlain =
        typeof question.get === "function"
          ? question.get({ plain: true })
          : question;
      const subQuestions: any[] = qPlain.questions || [];
      const options: any[] = qPlain.options || [];

      // Find the matching sub-question by questionNumber
      const subQuestion = subQuestions.find(
        (sq: any) => sq.questionNumber === questionNumber,
      );

      let correctAnswer: string | null = null;
      let explanation: string | null = null;
      let fromPassage: string | null = null;
      let questionText: string | null = qPlain.questionText || null;
      let points = 1;
      let optionText: string | null = null;
      let answerText: string | null = null;

      if (subQuestion) {
        correctAnswer = subQuestion.correctAnswer || null;
        explanation = subQuestion.explanation || qPlain.explanation || null;
        fromPassage = subQuestion.fromPassage || qPlain.fromPassage || null;
        questionText = subQuestion.questionText || questionText;
        points = subQuestion.points ? Number(subQuestion.points) : 1;
      } else if (options.length > 0) {
        const correctOption = options.find((opt: any) => opt.isCorrect);
        if (correctOption) {
          correctAnswer = correctOption.optionKey || null;
          explanation = correctOption.explanation || qPlain.explanation || null;
          fromPassage = correctOption.fromPassage || qPlain.fromPassage || null;
          optionText = correctOption.optionText || null;
        }
        points = qPlain.points ? Number(qPlain.points) : 1;
      } else {
        explanation = qPlain.explanation || null;
        fromPassage = qPlain.fromPassage || null;
        points = qPlain.points ? Number(qPlain.points) : 1;
      }

      const userAnswer = (answer.answer || "").trim();
      const isCorrect = correctAnswer
        ? this.compareAnswers(userAnswer, correctAnswer)
        : null;
      const earnedPoints = isCorrect ? points : 0;

      return {
        questionId,
        questionNumber,
        questionType: qPlain.type || null,
        questionText,
        userAnswer: answer.answer,
        correctAnswer,
        isCorrect,
        points,
        earnedPoints,
        explanation,
        fromPassage,
        questionParts: [],
        answerText,
        optionText,
      };
    });
  }

  private buildUngradedResult(answer: any) {
    return {
      questionId: answer.question_id,
      questionNumber: parseInt(answer.question_number, 10),
      questionType: null,
      questionText: null,
      userAnswer: answer.answer,
      correctAnswer: null,
      isCorrect: null,
      points: 1,
      earnedPoints: 0,
      explanation: null,
      fromPassage: null,
      questionParts: [],
      answerText: null,
      optionText: null,
    };
  }

  /**
   * Build result entries for all questions the user did NOT answer.
   * userAnswer and earnedPoints are set to null.
   */
  private buildUnansweredResults(
    allScopeQuestions: any[],
    answeredQuestionNumbers: Set<number>,
  ): any[] {
    const unanswered: any[] = [];

    for (const q of allScopeQuestions) {
      const qPlain = typeof q.get === "function" ? q.get({ plain: true }) : q;
      const subQuestions: any[] = qPlain.questions || [];
      const options: any[] = qPlain.options || [];

      if (subQuestions.length > 0) {
        // Each sub-question is an answerable item
        for (const sq of subQuestions) {
          const sqNumber = sq.questionNumber;
          if (sqNumber != null && !answeredQuestionNumbers.has(sqNumber)) {
            let correctAnswer: string | null = sq.correctAnswer || null;
            let optionText: string | null = null;

            unanswered.push({
              questionId: sq.id,
              questionNumber: sqNumber,
              questionType: qPlain.type || null,
              questionText: sq.questionText || qPlain.questionText || null,
              userAnswer: null,
              correctAnswer,
              isCorrect: null,
              points: sq.points ? Number(sq.points) : 1,
              earnedPoints: null,
              explanation: sq.explanation || qPlain.explanation || null,
              fromPassage: sq.fromPassage || qPlain.fromPassage || null,
              questionParts: [],
              answerText: null,
              optionText,
            });
          }
        }
      } else {
        // Parent question itself is the answerable item
        const qNumber = qPlain.questionNumber;
        if (qNumber != null && !answeredQuestionNumbers.has(qNumber)) {
          let correctAnswer: string | null = null;
          let optionText: string | null = null;

          if (options.length > 0) {
            const correctOption = options.find((opt: any) => opt.isCorrect);
            if (correctOption) {
              correctAnswer = correctOption.optionKey || null;
              optionText = correctOption.optionText || null;
            }
          }

          unanswered.push({
            questionId: qPlain.id,
            questionNumber: qNumber,
            questionType: qPlain.type || null,
            questionText: qPlain.questionText || null,
            userAnswer: null,
            correctAnswer,
            isCorrect: null,
            points: qPlain.points ? Number(qPlain.points) : 1,
            earnedPoints: null,
            explanation: qPlain.explanation || null,
            fromPassage: qPlain.fromPassage || null,
            questionParts: [],
            answerText: null,
            optionText,
          });
        }
      }
    }

    return unanswered;
  }

  private compareAnswers(userAnswer: string, correctAnswer: string): boolean {
    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = correctAnswer.trim().toLowerCase();
    return normalizedUser === normalizedCorrect;
  }

  private calculateBandScore(
    correctAnswers: number,
    totalQuestions: number,
  ): number {
    // Normalize to a 40-question scale (standard IELTS reading)
    const normalized =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 40)
        : 0;

    // Standard IELTS Academic Reading band score mapping
    if (normalized >= 39) return 9.0;
    if (normalized >= 37) return 8.5;
    if (normalized >= 35) return 8.0;
    if (normalized >= 33) return 7.5;
    if (normalized >= 30) return 7.0;
    if (normalized >= 27) return 6.5;
    if (normalized >= 23) return 6.0;
    if (normalized >= 19) return 5.5;
    if (normalized >= 15) return 5.0;
    if (normalized >= 13) return 4.5;
    if (normalized >= 10) return 4.0;
    if (normalized >= 8) return 3.5;
    if (normalized >= 6) return 3.0;
    if (normalized >= 4) return 2.5;
    if (normalized >= 3) return 2.0;
    if (normalized >= 2) return 1.5;
    if (normalized >= 1) return 1.0;
    return 0;
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
