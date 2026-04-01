import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/sequelize";
import { IeltsTest } from "./entities/ielts-test.entity.js";
import { IeltsReading } from "./entities/ielts-reading.entity.js";
import { IeltsReadingPart } from "./entities/ielts-reading-part.entity.js";
import { IeltsListening } from "./entities/ielts-listening.entity.js";
import { IeltsListeningPart } from "./entities/ielts-listening-part.entity.js";
import { IeltsWriting } from "./entities/ielts-writing.entity.js";
import { IeltsWritingTask } from "./entities/ielts-writing-task.entity.js";
import { IeltsQuestion } from "./entities/ielts-question.entity.js";
import { IeltsQuestionOption } from "./entities/ielts-question-option.entity.js";
import { IeltsSubQuestion } from "./entities/ielts-multiple-choice-question.entity.js";
import { IeltsReadingReadingPart } from "./entities/ielts-reading-reading-part.entity.js";
import { IeltsListeningListeningPart } from "./entities/ielts-listening-listening-part.entity.js";
import { IeltsWritingWritingTask } from "./entities/ielts-writing-writing-task.entity.js";
import { CreateTestDto } from "./dto/create-test.dto.js";
import { UpdateTestDto } from "./dto/update-test.dto.js";
import { CreateReadingDto } from "./dto/create-reading.dto.js";
import { UpdateReadingDto } from "./dto/update-reading.dto.js";
import { CreateReadingPartDto } from "./dto/create-reading-part.dto.js";
import { CreateListeningDto } from "./dto/create-listening.dto.js";
import { UpdateListeningDto } from "./dto/update-listening.dto.js";
import { CreateListeningPartDto } from "./dto/create-listening-part.dto.js";
import { CreateIeltsWritingDto } from "./dto/create-writing.dto.js";
import { CreateWritingTaskDto } from "./dto/create-writing-task.dto.js";
import { UpdateIeltsWritingDto } from "./dto/update-writing.dto.js";
import { UpdateWritingTaskDto } from "./dto/update-writing-task.dto.js";
import { CreateQuestionDto, QuestionTypeEnum } from "./dto/create-question.dto.js";
import { CreateQuestionOptionDto } from "./dto/create-question-option.dto.js";
import { CreateSubQuestionDto } from "./dto/create-multiple-choice-question.dto.js";
import { UpdateReadingPartDto } from "./dto/update-reading-part.dto.js";
import { UpdateListeningPartDto } from "./dto/update-listening-part.dto.js";
import { UpdateQuestionDto } from "./dto/update-question.dto.js";
import { UpdateQuestionOptionDto } from "./dto/update-question-option.dto.js";
import { UpdateSubQuestionDto } from "./dto/update-multiple-choice-question.dto.js";
import {
  LinkReadingPartDto,
  UnlinkReadingPartDto,
} from "./dto/link-reading-part.dto.js";
import {
  LinkListeningPartDto,
  UnlinkListeningPartDto,
} from "./dto/link-listening-part.dto.js";
import {
  LinkWritingTaskDto,
  UnlinkWritingTaskDto,
} from "./dto/link-writing-task.dto.js";
import {
  TestQueryDto,
  ReadingQueryDto,
  ListeningQueryDto,
  WritingQueryDto,
  WritingTaskQueryDto,
  ReadingPartQueryDto,
  ListeningPartQueryDto,
  QuestionQueryDto,
  QuestionOptionQueryDto,
  SubQuestionQueryDto,
  CombinedSkillsQueryDto,
} from "./dto/query.dto.js";
import { User } from "../users/entities/user.entity.js";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class IeltsTestsService {
  constructor(
    @InjectModel(IeltsTest)
    private readonly ieltsTestModel: typeof IeltsTest,
    @InjectModel(IeltsReading)
    private readonly ieltsReadingModel: typeof IeltsReading,
    @InjectModel(IeltsReadingPart)
    private readonly ieltsReadingPartModel: typeof IeltsReadingPart,
    @InjectModel(IeltsListening)
    private readonly ieltsListeningModel: typeof IeltsListening,
    @InjectModel(IeltsListeningPart)
    private readonly ieltsListeningPartModel: typeof IeltsListeningPart,
    @InjectModel(IeltsWriting)
    private readonly ieltsWritingModel: typeof IeltsWriting,
    @InjectModel(IeltsWritingTask)
    private readonly ieltsWritingTaskModel: typeof IeltsWritingTask,
    @InjectModel(IeltsQuestion)
    private readonly ieltsQuestionModel: typeof IeltsQuestion,
    @InjectModel(IeltsQuestionOption)
    private readonly ieltsQuestionOptionModel: typeof IeltsQuestionOption,
    @InjectModel(IeltsSubQuestion)
    private readonly ieltsSubQuestionModel: typeof IeltsSubQuestion,
    @InjectModel(IeltsReadingReadingPart)
    private readonly ieltsReadingReadingPartModel: typeof IeltsReadingReadingPart,
    @InjectModel(IeltsListeningListeningPart)
    private readonly ieltsListeningListeningPartModel: typeof IeltsListeningListeningPart,
    @InjectModel(IeltsWritingWritingTask)
    private readonly ieltsWritingWritingTaskModel: typeof IeltsWritingWritingTask,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  // ========== Helpers ==========
  private readonly romanOrder: Record<string, number> = {
    i: 1,
    ii: 2,
    iii: 3,
    iv: 4,
    v: 5,
    vi: 6,
    vii: 7,
    viii: 8,
    ix: 9,
    x: 10,
    xi: 11,
    xii: 12,
    xiii: 13,
    xiv: 14,
    xv: 15,
  };

  private readonly allowedQuestionTypes = new Set<string>(
    Object.values(QuestionTypeEnum),
  );

  private ensureImportObject(payload: any): asserts payload is Record<string, any> {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new BadRequestException(
        "Invalid JSON payload. Expected an object with test, reading, listening, and writing sections.",
      );
    }
  }

  private normalizeToArray<T>(value: T | T[] | null | undefined): T[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  private pickString(...values: any[]): string | undefined {
    for (const value of values) {
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
    return undefined;
  }

  private validateQuestionType(type: any, contextPath: string): void {
    if (!type) return;
    if (!this.allowedQuestionTypes.has(type)) {
      throw new BadRequestException(
        `${contextPath}.type is invalid. Allowed values: ${Array.from(this.allowedQuestionTypes).join(", ")}`,
      );
    }
  }

  async importFullIeltsTestFromJson(payload: any, createdBy: string) {
    this.ensureImportObject(payload);

    const testInput = payload.test ?? payload.testInfo;
    if (!testInput) {
      throw new BadRequestException("Missing test section in JSON payload.");
    }

    const readingInput = payload.reading ?? payload.readings;
    const listeningInput = payload.listening ?? payload.listenings;
    const writingInput = payload.writing ?? payload.writings;

    if (!readingInput || !listeningInput || !writingInput) {
      throw new BadRequestException(
        "Payload must include reading, listening, and writing sections.",
      );
    }

    const testTitle = this.pickString(testInput.title);
    const testMode = this.pickString(testInput.mode);

    if (!testTitle) {
      throw new BadRequestException("test.title is required.");
    }

    if (!testMode || !["practice", "mock"].includes(testMode)) {
      throw new BadRequestException("test.mode must be either 'practice' or 'mock'.");
    }

    const transaction = await this.sequelize.transaction();

    try {
      const createdTest = await this.ieltsTestModel.create(
        {
          title: testTitle,
          mode: testMode,
          status: this.pickString(testInput.status) ?? "draft",
          category: this.pickString(testInput.category),
          created_by: createdBy,
        } as any,
        { transaction },
      );

      const createdReadings: any[] = [];
      const createdListenings: any[] = [];
      const createdWritings: any[] = [];

      for (const reading of this.normalizeToArray<any>(readingInput)) {
        const createdReading = await this.ieltsReadingModel.create(
          {
            title: this.pickString(reading?.title) ?? "Reading",
            test_id: createdTest.id,
          } as any,
          { transaction },
        );

        const readingParts = this.normalizeToArray<any>(
          reading?.parts ?? reading?.readingParts,
        );

        const createdParts: any[] = [];
        for (let partIndex = 0; partIndex < readingParts.length; partIndex++) {
          const part = readingParts[partIndex];

          const createdPart = await this.ieltsReadingPartModel.create(
            {
              reading_id: createdReading.id,
              part: part?.part,
              mode: this.pickString(part?.mode) ?? testMode,
              title: this.pickString(part?.title),
              content: part?.content,
              timeLimitMinutes: part?.timeLimitMinutes,
              difficulty: part?.difficulty,
              isActive: part?.isActive,
              totalQuestions: part?.totalQuestions,
            } as any,
            { transaction },
          );

          const questions = this.normalizeToArray<any>(
            part?.questions ?? part?.questionGroups,
          );

          for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
            const question = questions[questionIndex];
            this.validateQuestionType(
              question?.type,
              `reading.parts[${partIndex}].questions[${questionIndex}]`,
            );

            const createdQuestion = await this.ieltsQuestionModel.create(
              {
                reading_part_id: createdPart.id,
                questionNumber: question?.questionNumber,
                type: question?.type,
                questionText: question?.questionText,
                instruction: question?.instruction,
                context: question?.context,
                headingOptions: question?.headingOptions,
                tableData: question?.tableData,
                points: question?.points,
                isActive: question?.isActive,
                explanation: question?.explanation,
                fromPassage: question?.fromPassage,
              } as any,
              { transaction },
            );

            const subQuestions = this.normalizeToArray<any>(question?.questions);
            if (subQuestions.length) {
              await this.ieltsSubQuestionModel.bulkCreate(
                subQuestions.map((sq) => ({
                  question_id: createdQuestion.id,
                  questionNumber: sq?.questionNumber,
                  questionText: sq?.questionText,
                  points: sq?.points,
                  correctAnswer: sq?.correctAnswer,
                  explanation: sq?.explanation,
                  fromPassage: sq?.fromPassage,
                  order: sq?.order,
                })) as any,
                { transaction },
              );
            }

            const options = this.normalizeToArray<any>(question?.options);
            if (options.length) {
              await this.ieltsQuestionOptionModel.bulkCreate(
                options.map((opt) => ({
                  question_id: createdQuestion.id,
                  optionKey: opt?.optionKey,
                  optionText: opt?.optionText,
                  isCorrect: opt?.isCorrect,
                  orderIndex: opt?.orderIndex,
                  explanation: opt?.explanation,
                  fromPassage: opt?.fromPassage,
                })) as any,
                { transaction },
              );
            }
          }

          createdParts.push({ id: createdPart.id, part: createdPart.part });
        }

        createdReadings.push({
          id: createdReading.id,
          title: createdReading.title,
          parts: createdParts,
        });
      }

      for (const listening of this.normalizeToArray<any>(listeningInput)) {
        const createdListening = await this.ieltsListeningModel.create(
          {
            title: this.pickString(listening?.title) ?? "Listening",
            description: listening?.description,
            test_id: createdTest.id,
            full_audio_url: this.pickString(listening?.full_audio_url),
            is_active: listening?.is_active,
          } as any,
          { transaction },
        );

        const listeningParts = this.normalizeToArray<any>(
          listening?.parts ?? listening?.listeningParts,
        );

        const createdParts: any[] = [];
        for (let partIndex = 0; partIndex < listeningParts.length; partIndex++) {
          const part = listeningParts[partIndex];

          const createdPart = await this.ieltsListeningPartModel.create(
            {
              listening_id: createdListening.id,
              part: part?.part,
              mode: this.pickString(part?.mode) ?? testMode,
              title: this.pickString(part?.title),
              audio_url: this.pickString(part?.audio_url, part?.audio?.url),
              transcript_url: this.pickString(
                part?.transcript_url,
                part?.transcript?.url,
              ),
              timeLimitMinutes: part?.timeLimitMinutes,
              difficulty: part?.difficulty,
              isActive: part?.isActive,
              totalQuestions: part?.totalQuestions,
            } as any,
            { transaction },
          );

          const questions = this.normalizeToArray<any>(
            part?.questions ?? part?.questionGroups,
          );

          for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
            const question = questions[questionIndex];
            this.validateQuestionType(
              question?.type,
              `listening.parts[${partIndex}].questions[${questionIndex}]`,
            );

            const createdQuestion = await this.ieltsQuestionModel.create(
              {
                listening_part_id: createdPart.id,
                questionNumber: question?.questionNumber,
                type: question?.type,
                questionText: question?.questionText,
                instruction: question?.instruction,
                context: question?.context,
                headingOptions: question?.headingOptions,
                tableData: question?.tableData,
                points: question?.points,
                isActive: question?.isActive,
                explanation: question?.explanation,
                fromPassage: question?.fromPassage,
              } as any,
              { transaction },
            );

            const subQuestions = this.normalizeToArray<any>(question?.questions);
            if (subQuestions.length) {
              await this.ieltsSubQuestionModel.bulkCreate(
                subQuestions.map((sq) => ({
                  question_id: createdQuestion.id,
                  questionNumber: sq?.questionNumber,
                  questionText: sq?.questionText,
                  points: sq?.points,
                  correctAnswer: sq?.correctAnswer,
                  explanation: sq?.explanation,
                  fromPassage: sq?.fromPassage,
                  order: sq?.order,
                })) as any,
                { transaction },
              );
            }

            const options = this.normalizeToArray<any>(question?.options);
            if (options.length) {
              await this.ieltsQuestionOptionModel.bulkCreate(
                options.map((opt) => ({
                  question_id: createdQuestion.id,
                  optionKey: opt?.optionKey,
                  optionText: opt?.optionText,
                  isCorrect: opt?.isCorrect,
                  orderIndex: opt?.orderIndex,
                  explanation: opt?.explanation,
                  fromPassage: opt?.fromPassage,
                })) as any,
                { transaction },
              );
            }
          }

          createdParts.push({ id: createdPart.id, part: createdPart.part });
        }

        createdListenings.push({
          id: createdListening.id,
          title: createdListening.title,
          parts: createdParts,
        });
      }

      for (const writing of this.normalizeToArray<any>(writingInput)) {
        const createdWriting = await this.ieltsWritingModel.create(
          {
            title: this.pickString(writing?.title) ?? "Writing",
            description: writing?.description,
            test_id: createdTest.id,
            is_active: writing?.is_active,
          } as any,
          { transaction },
        );

        const tasks = this.normalizeToArray<any>(writing?.tasks);
        const createdTasks: any[] = [];
        for (const task of tasks) {
          const createdTask = await this.ieltsWritingTaskModel.create(
            {
              writing_id: createdWriting.id,
              task: task?.task,
              mode: this.pickString(task?.mode) ?? testMode,
              prompt: task?.prompt,
              image_url: this.pickString(task?.image_url),
              min_words: task?.min_words,
              suggested_time: task?.suggested_time,
            } as any,
            { transaction },
          );

          createdTasks.push({ id: createdTask.id, task: createdTask.task });
        }

        createdWritings.push({
          id: createdWriting.id,
          title: createdWriting.title,
          tasks: createdTasks,
        });
      }

      await transaction.commit();

      return {
        message: "IELTS test imported successfully from JSON.",
        test: {
          id: createdTest.id,
          title: createdTest.title,
          mode: createdTest.mode,
          status: createdTest.status,
          category: createdTest.category,
        },
        reading: createdReadings,
        listening: createdListenings,
        writing: createdWritings,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private sortHeadingOptions(
    headingOptions: Record<string, any> | null,
  ): Record<string, any> | null {
    if (
      !headingOptions ||
      typeof headingOptions !== "object" ||
      Array.isArray(headingOptions)
    ) {
      return headingOptions;
    }
    const sortedKeys = Object.keys(headingOptions).sort((a, b) => {
      const orderA = this.romanOrder[a.toLowerCase()] ?? 999;
      const orderB = this.romanOrder[b.toLowerCase()] ?? 999;
      return orderA - orderB;
    });
    const sorted: Record<string, any> = {};
    for (const key of sortedKeys) {
      sorted[key] = headingOptions[key];
    }
    return sorted;
  }

  private sortQuestionsHeadingOptions(data: any): any {
    if (!data) return data;
    const plain = typeof data.toJSON === "function" ? data.toJSON() : data;

    const sortQuestions = (questions: any[]) => {
      if (!questions) return questions;
      return questions.map((q: any) => ({
        ...q,
        headingOptions: this.sortHeadingOptions(q.headingOptions),
      }));
    };

    // If data itself has headingOptions (single question)
    if (plain.headingOptions) {
      plain.headingOptions = this.sortHeadingOptions(plain.headingOptions);
    }

    // If data has questions directly
    if (plain.questions) {
      plain.questions = sortQuestions(plain.questions);
    }

    // If data has parts with questions
    if (plain.parts) {
      plain.parts = plain.parts.map((part: any) => ({
        ...part,
        questions: sortQuestions(part.questions),
      }));
    }

    return plain;
  }

  // ========== Tests ==========
  async createTest(createTestDto: CreateTestDto): Promise<IeltsTest> {
    return await this.ieltsTestModel.create(createTestDto as any);
  }

  async findAllTests(query: TestQueryDto) {
    const { page = 1, limit = 10, search, mode, status, category } = query;
    const where: any = {};

    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    if (mode) {
      where.mode = mode;
    }
    if (status) {
      where.status = status;
    }
    if (category) {
      where.category = category;
    }

    const { rows, count } = await this.ieltsTestModel.findAndCountAll({
      where,
      include: [{ model: User, as: "creator" }],
      order: [["orderId", "ASC"]],
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

  async findAllSkills(query: CombinedSkillsQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      testId,
      mode,
      status,
      category,
      isActive,
    } = query;

    const buildTestWhere = () => {
      const testWhere: any = {};
      if (mode) testWhere.mode = mode;
      if (status) testWhere.status = status;
      if (category) testWhere.category = category;
      return Object.keys(testWhere).length ? testWhere : undefined;
    };

    const fetchReadings = async () => {
      const where: any = {};
      if (search) where.title = { [Op.like]: `%${search}%` };
      if (testId) where.test_id = testId;

      const { rows, count } = await this.ieltsReadingModel.findAndCountAll({
        where,
        include: [{ model: IeltsTest, as: "test", where: buildTestWhere() }],
        order: [["createdAt", "DESC"]],
        limit,
        offset: (page - 1) * limit,
        distinct: true,
      });

      return {
        data: rows.map((r) => ({ ...r.toJSON(), skill: "reading" })),
        total: count,
      };
    };

    const fetchListenings = async () => {
      const where: any = {};
      if (search) where.title = { [Op.like]: `%${search}%` };
      if (testId) where.test_id = testId;
      if (isActive !== undefined) where.is_active = isActive;

      const { rows, count } = await this.ieltsListeningModel.findAndCountAll({
        where,
        include: [{ model: IeltsTest, as: "test", where: buildTestWhere() }],
        order: [["orderId", "ASC"]],
        limit,
        offset: (page - 1) * limit,
      });

      return {
        data: rows.map((r) => ({ ...r.toJSON(), skill: "listening" })),
        total: count,
      };
    };

    const fetchWritings = async () => {
      const where: any = {};
      if (search) where.title = { [Op.like]: `%${search}%` };
      if (testId) where.test_id = testId;
      if (isActive !== undefined) where.is_active = isActive;

      const { rows, count } = await this.ieltsWritingModel.findAndCountAll({
        where,
        include: [{ model: IeltsTest, as: "test", where: buildTestWhere() }],
        order: [["orderId", "ASC"]],
        limit,
        offset: (page - 1) * limit,
      });

      return {
        data: rows.map((r) => ({ ...r.toJSON(), skill: "writing" })),
        total: count,
      };
    };

    if (type === "reading") {
      const result = await fetchReadings();
      return {
        data: result.data,
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      };
    }

    if (type === "listening") {
      const result = await fetchListenings();
      return {
        data: result.data,
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      };
    }

    if (type === "writing") {
      const result = await fetchWritings();
      return {
        data: result.data,
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      };
    }

    // No type filter — fetch all three skills
    const [readings, listenings, writings] = await Promise.all([
      fetchReadings(),
      fetchListenings(),
      fetchWritings(),
    ]);

    const combined = [
      ...readings.data,
      ...listenings.data,
      ...writings.data,
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const totalAll = readings.total + listenings.total + writings.total;

    return {
      data: combined,
      total: totalAll,
      page,
      limit,
      totalPages: Math.ceil(totalAll / limit),
      breakdown: {
        reading: readings.total,
        listening: listenings.total,
        writing: writings.total,
      },
    };
  }

  async findTestById(id: string): Promise<IeltsTest> {
    const test = await this.ieltsTestModel.findByPk(id, {
      include: [
        { model: IeltsReading, as: "readings" },
        { model: IeltsListening, as: "listenings" },
        { model: IeltsWriting, as: "writings" },
      ],
      order: [
        [{ model: IeltsReading, as: "readings" }, "orderId", "ASC"],
        [{ model: IeltsListening, as: "listenings" }, "orderId", "ASC"],
        [{ model: IeltsWriting, as: "writings" }, "orderId", "ASC"],
      ],
    });

    if (!test) {
      throw new NotFoundException(`Test with ID ${id} not found`);
    }

    return test;
  }

  async updateTest(
    id: string,
    updateTestDto: UpdateTestDto,
  ): Promise<IeltsTest> {
    const test = await this.findTestById(id);
    await test.update(updateTestDto);
    return test;
  }

  async deleteTest(id: string): Promise<void> {
    const test = await this.findTestById(id);
    await test.destroy();
  }

  // ========== Reading ==========
  async createReading(
    createReadingDto: CreateReadingDto,
  ): Promise<IeltsReading> {
    return await this.ieltsReadingModel.create(createReadingDto as any);
  }

  async findAllReadings(query: ReadingQueryDto) {
    const { page = 1, limit = 10, search, testId, mode, part } = query;
    const where: any = {};

    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    if (testId) {
      where.test_id = testId;
    }

    const testWhere: any = {};
    if (mode) {
      testWhere.mode = mode;
    }

    const includes: any[] = [
      {
        model: IeltsTest,
        as: "test",
        where: Object.keys(testWhere).length ? testWhere : undefined,
      },
    ];

    if (part) {
      includes.push({
        model: IeltsReadingPart,
        as: "parts",
        where: { part },
        required: true,
      });
    }

    const { rows, count } = await this.ieltsReadingModel.findAndCountAll({
      where,
      include: includes,
      order: [["orderId", "ASC"]],
      limit,
      offset: (page - 1) * limit,
      distinct: true,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findReadingById(id: string): Promise<IeltsReading> {
    const reading = await this.ieltsReadingModel.findByPk(id, {
      include: [
        { model: IeltsTest, as: "test" },
        {
          model: IeltsReadingPart,
          as: "parts",
          include: [
            {
              model: IeltsQuestion,
              as: "questions",
              include: [
                { model: IeltsSubQuestion, as: "questions" },
                { model: IeltsQuestionOption, as: "options" },
              ],
            },
          ],
        },
      ],
      order: [
        [
          { model: IeltsReadingPart, as: "parts" },
          { model: IeltsQuestion, as: "questions" },
          "questionNumber",
          "ASC",
        ],
        [
          { model: IeltsReadingPart, as: "parts" },
          { model: IeltsQuestion, as: "questions" },
          { model: IeltsSubQuestion, as: "questions" },
          "order",
          "ASC",
        ],
        [
          { model: IeltsReadingPart, as: "parts" },
          { model: IeltsQuestion, as: "questions" },
          { model: IeltsSubQuestion, as: "questions" },
          "questionNumber",
          "ASC",
        ],
        [
          { model: IeltsReadingPart, as: "parts" },
          { model: IeltsQuestion, as: "questions" },
          { model: IeltsQuestionOption, as: "options" },
          "orderIndex",
          "ASC",
        ],
      ],
    });

    if (!reading) {
      throw new NotFoundException(`Reading with ID ${id} not found`);
    }

    return this.sortQuestionsHeadingOptions(reading);
  }

  async updateReading(
    id: string,
    updateReadingDto: UpdateReadingDto,
  ): Promise<IeltsReading> {
    const reading = await this.ieltsReadingModel.findByPk(id);
    if (!reading) {
      throw new NotFoundException(`Reading with ID ${id} not found`);
    }
    await reading.update(updateReadingDto);
    return reading;
  }

  async deleteReading(id: string): Promise<void> {
    const reading = await this.ieltsReadingModel.findByPk(id);
    if (!reading) {
      throw new NotFoundException(`Reading with ID ${id} not found`);
    }
    await reading.destroy();
  }

  // ========== Reading Parts ==========
  async createReadingPart(
    createReadingPartDto: CreateReadingPartDto,
  ): Promise<IeltsReadingPart> {
    return await this.ieltsReadingPartModel.create(
      createReadingPartDto as any,
      {
        include: [
          {
            model: IeltsQuestion,
            as: "questions",
            include: [
              { model: IeltsSubQuestion, as: "questions" },
              { model: IeltsQuestionOption, as: "options" },
            ],
          },
        ],
      },
    );
  }

  async findAllReadingParts(query: ReadingPartQueryDto) {
    const { page = 1, limit = 10, search, readingId, part, mode } = query;
    const where: any = {};

    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    if (readingId) {
      where.reading_id = readingId;
    }
    if (part) {
      where.part = part;
    }
    if (mode) {
      where.mode = mode;
    }

    const { rows, count } = await this.ieltsReadingPartModel.findAndCountAll({
      where,
      include: [{ model: IeltsReading, as: "reading" }],
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

  async findReadingPartById(id: string): Promise<IeltsReadingPart> {
    const part = await this.ieltsReadingPartModel.findByPk(id, {
      include: [
        { model: IeltsReading, as: "reading" },
        {
          model: IeltsQuestion,
          as: "questions",
          include: [
            { model: IeltsSubQuestion, as: "questions" },
            { model: IeltsQuestionOption, as: "options" },
          ],
        },
      ],
      order: [
        [{ model: IeltsQuestion, as: "questions" }, "questionNumber", "ASC"],
        [
          { model: IeltsQuestion, as: "questions" },
          { model: IeltsSubQuestion, as: "questions" },
          "order",
          "ASC",
        ],
        [
          { model: IeltsQuestion, as: "questions" },
          { model: IeltsSubQuestion, as: "questions" },
          "questionNumber",
          "ASC",
        ],
        [
          { model: IeltsQuestion, as: "questions" },
          { model: IeltsQuestionOption, as: "options" },
          "orderIndex",
          "ASC",
        ],
      ],
    });

    if (!part) {
      throw new NotFoundException(`Reading part with ID ${id} not found`);
    }

    return this.sortQuestionsHeadingOptions(part);
  }

  async updateReadingPart(
    id: string,
    updateReadingPartDto: UpdateReadingPartDto,
  ): Promise<IeltsReadingPart> {
    const part = await this.ieltsReadingPartModel.findByPk(id);
    if (!part) {
      throw new NotFoundException(`Reading part with ID ${id} not found`);
    }
    await part.update(updateReadingPartDto as any);
    return part;
  }

  async deleteReadingPart(id: string): Promise<void> {
    const part = await this.ieltsReadingPartModel.findByPk(id);
    if (!part) {
      throw new NotFoundException(`Reading part with ID ${id} not found`);
    }
    await part.destroy();
  }

  // ========== Listening ==========
  async createListening(
    createListeningDto: CreateListeningDto,
  ): Promise<IeltsListening> {
    return await this.ieltsListeningModel.create(createListeningDto as any);
  }

  async findAllListenings(query: ListeningQueryDto) {
    const { page = 1, limit = 10, search, testId, isActive, mode } = query;
    const where: any = {};

    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    if (testId) {
      where.test_id = testId;
    }
    if (isActive !== undefined) {
      where.is_active = isActive;
    }

    const testWhere: any = {};
    if (mode) {
      testWhere.mode = mode;
    }

    const { rows, count } = await this.ieltsListeningModel.findAndCountAll({
      where,
      include: [
        {
          model: IeltsTest,
          as: "test",
          where: Object.keys(testWhere).length ? testWhere : undefined,
        },
      ],
      order: [["orderId", "ASC"]],
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

  async findListeningById(id: string): Promise<IeltsListening> {
    const listening = await this.ieltsListeningModel.findByPk(id, {
      include: [
        { model: IeltsTest, as: "test" },
        {
          model: IeltsListeningPart,
          as: "parts",
          include: [
            {
              model: IeltsQuestion,
              as: "questions",
              include: [
                { model: IeltsSubQuestion, as: "questions" },
                { model: IeltsQuestionOption, as: "options" },
              ],
            },
          ],
        },
      ],
      order: [
        [
          { model: IeltsListeningPart, as: "parts" },
          { model: IeltsQuestion, as: "questions" },
          "questionNumber",
          "ASC",
        ],
        [
          { model: IeltsListeningPart, as: "parts" },
          { model: IeltsQuestion, as: "questions" },
          { model: IeltsSubQuestion, as: "questions" },
          "order",
          "ASC",
        ],
        [
          { model: IeltsListeningPart, as: "parts" },
          { model: IeltsQuestion, as: "questions" },
          { model: IeltsSubQuestion, as: "questions" },
          "questionNumber",
          "ASC",
        ],
        [
          { model: IeltsListeningPart, as: "parts" },
          { model: IeltsQuestion, as: "questions" },
          { model: IeltsQuestionOption, as: "options" },
          "orderIndex",
          "ASC",
        ],
      ],
    });

    if (!listening) {
      throw new NotFoundException(`Listening with ID ${id} not found`);
    }

    return this.sortQuestionsHeadingOptions(listening);
  }

  async updateListening(
    id: string,
    updateListeningDto: UpdateListeningDto,
  ): Promise<IeltsListening> {
    const listening = await this.ieltsListeningModel.findByPk(id);
    if (!listening) {
      throw new NotFoundException(`Listening with ID ${id} not found`);
    }
    await listening.update(updateListeningDto);
    return listening;
  }

  async deleteListening(id: string): Promise<void> {
    const listening = await this.ieltsListeningModel.findByPk(id);
    if (!listening) {
      throw new NotFoundException(`Listening with ID ${id} not found`);
    }
    await listening.destroy();
  }

  // ========== Listening Parts ==========
  async createListeningPart(
    createListeningPartDto: CreateListeningPartDto,
  ): Promise<IeltsListeningPart> {
    const listeningPart = await this.ieltsListeningPartModel.create(
      createListeningPartDto as any,
      {
        include: [
          {
            model: IeltsQuestion,
            as: "questions",
            include: [
              { model: IeltsSubQuestion, as: "questions" },
              { model: IeltsQuestionOption, as: "options" },
            ],
          },
        ],
      },
    );

    // Re-fetch with all associations
    return await this.ieltsListeningPartModel.findByPk(listeningPart.id, {
      include: [
        { model: IeltsListening, as: "listening" },
        {
          model: IeltsQuestion,
          as: "questions",
          include: [
            { model: IeltsSubQuestion, as: "questions" },
            { model: IeltsQuestionOption, as: "options" },
          ],
        },
      ],
      order: [
        [{ model: IeltsQuestion, as: "questions" }, "questionNumber", "ASC"],
        [
          { model: IeltsQuestion, as: "questions" },
          { model: IeltsSubQuestion, as: "questions" },
          "order",
          "ASC",
        ],
        [
          { model: IeltsQuestion, as: "questions" },
          { model: IeltsQuestionOption, as: "options" },
          "orderIndex",
          "ASC",
        ],
      ],
    });
  }

  async findAllListeningParts(query: ListeningPartQueryDto) {
    const { page = 1, limit = 10, search, listeningId, part, mode } = query;
    const where: any = {};

    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    if (listeningId) {
      where.listening_id = listeningId;
    }
    if (part) {
      where.part = part;
    }
    if (mode) {
      where.mode = mode;
    }

    const { rows, count } = await this.ieltsListeningPartModel.findAndCountAll({
      where,
      include: [{ model: IeltsListening, as: "listening" }],
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

  async findListeningPartById(id: string): Promise<IeltsListeningPart> {
    const part = await this.ieltsListeningPartModel.findByPk(id, {
      include: [
        { model: IeltsListening, as: "listening" },
        {
          model: IeltsQuestion,
          as: "questions",
          include: [
            { model: IeltsSubQuestion, as: "questions" },
            { model: IeltsQuestionOption, as: "options" },
          ],
        },
      ],
      order: [
        [{ model: IeltsQuestion, as: "questions" }, "questionNumber", "ASC"],
        [
          { model: IeltsQuestion, as: "questions" },
          { model: IeltsSubQuestion, as: "questions" },
          "order",
          "ASC",
        ],
        [
          { model: IeltsQuestion, as: "questions" },
          { model: IeltsSubQuestion, as: "questions" },
          "questionNumber",
          "ASC",
        ],
        [
          { model: IeltsQuestion, as: "questions" },
          { model: IeltsQuestionOption, as: "options" },
          "orderIndex",
          "ASC",
        ],
      ],
    });

    if (!part) {
      throw new NotFoundException(`Listening part with ID ${id} not found`);
    }

    return this.sortQuestionsHeadingOptions(part);
  }

  async updateListeningPart(
    id: string,
    updateListeningPartDto: UpdateListeningPartDto,
  ): Promise<IeltsListeningPart> {
    const part = await this.ieltsListeningPartModel.findByPk(id);
    if (!part) {
      throw new NotFoundException(`Listening part with ID ${id} not found`);
    }

    await part.update(updateListeningPartDto as any);

    // Re-fetch with all associations
    return await this.ieltsListeningPartModel.findByPk(id, {
      include: [
        { model: IeltsListening, as: "listening" },
        {
          model: IeltsQuestion,
          as: "questions",
          include: [
            { model: IeltsSubQuestion, as: "questions" },
            { model: IeltsQuestionOption, as: "options" },
          ],
        },
      ],
      order: [
        [{ model: IeltsQuestion, as: "questions" }, "questionNumber", "ASC"],
      ],
    });
  }

  async deleteListeningPart(id: string): Promise<void> {
    const part = await this.ieltsListeningPartModel.findByPk(id);
    if (!part) {
      throw new NotFoundException(`Listening part with ID ${id} not found`);
    }
    await part.destroy();
  }

  // ========== Writing ==========
  async createWriting(
    createWritingDto: CreateIeltsWritingDto,
  ): Promise<IeltsWriting> {
    return await this.ieltsWritingModel.create(createWritingDto as any);
  }

  async findAllWritings(query: WritingQueryDto) {
    const { page = 1, limit = 10, search, testId, isActive, mode } = query;
    const where: any = {};

    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    if (testId) {
      where.test_id = testId;
    }
    if (isActive !== undefined) {
      where.is_active = isActive;
    }

    const testWhere: any = {};
    if (mode) {
      testWhere.mode = mode;
    }

    const { rows, count } = await this.ieltsWritingModel.findAndCountAll({
      where,
      include: [
        {
          model: IeltsTest,
          as: "test",
          where: Object.keys(testWhere).length ? testWhere : undefined,
        },
      ],
      order: [["orderId", "ASC"]],
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

  async findWritingById(id: string): Promise<IeltsWriting> {
    const writing = await this.ieltsWritingModel.findByPk(id, {
      include: [
        { model: IeltsTest, as: "test" },
        { model: IeltsWritingTask, as: "tasks" },
      ],
    });

    if (!writing) {
      throw new NotFoundException(`Writing with ID ${id} not found`);
    }

    return writing;
  }

  async updateWriting(
    id: string,
    updateWritingDto: UpdateIeltsWritingDto,
  ): Promise<IeltsWriting> {
    const writing = await this.findWritingById(id);
    await writing.update(updateWritingDto);
    return writing;
  }

  async deleteWriting(id: string): Promise<void> {
    const writing = await this.findWritingById(id);
    await writing.destroy();
  }

  // ========== Writing Tasks ==========
  async createWritingTask(
    createWritingTaskDto: CreateWritingTaskDto,
  ): Promise<IeltsWritingTask> {
    return await this.ieltsWritingTaskModel.create(createWritingTaskDto as any);
  }

  async findAllWritingTasks(query: WritingTaskQueryDto) {
    const { page = 1, limit = 10, search, writingId, task, mode } = query;
    const where: any = {};

    if (search) {
      where.prompt = { [Op.like]: `%${search}%` };
    }
    if (writingId) {
      where.writing_id = writingId;
    }
    if (task) {
      where.task = task;
    }
    if (mode) {
      where.mode = mode;
    }

    const { rows, count } = await this.ieltsWritingTaskModel.findAndCountAll({
      where,
      include: [{ model: IeltsWriting, as: "writing" }],
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

  async findWritingTaskById(id: string): Promise<IeltsWritingTask> {
    const task = await this.ieltsWritingTaskModel.findByPk(id, {
      include: [{ model: IeltsWriting, as: "writing" }],
    });

    if (!task) {
      throw new NotFoundException(`Writing task with ID ${id} not found`);
    }

    return task;
  }

  async updateWritingTask(
    id: string,
    updateWritingTaskDto: UpdateWritingTaskDto,
  ): Promise<IeltsWritingTask> {
    const task = await this.findWritingTaskById(id);
    await task.update(updateWritingTaskDto as any);
    return task;
  }

  async deleteWritingTask(id: string): Promise<void> {
    const task = await this.findWritingTaskById(id);
    await task.destroy();
  }

  // ========== Questions ==========
  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<IeltsQuestion> {
    const { questions, options, ...questionData } = createQuestionDto;
    const question = await this.ieltsQuestionModel.create(questionData as any);

    if (questions && questions.length > 0) {
      const subQuestions = questions.map((sq) => ({
        ...sq,
        question_id: question.id,
      }));
      await this.ieltsSubQuestionModel.bulkCreate(subQuestions as any);
    }

    if (options && options.length > 0) {
      const questionOptions = options.map((opt) => ({
        ...opt,
        question_id: question.id,
      }));
      await this.ieltsQuestionOptionModel.bulkCreate(questionOptions as any);
    }

    return await this.ieltsQuestionModel.findByPk(question.id, {
      include: [
        { model: IeltsSubQuestion, as: "questions" },
        { model: IeltsQuestionOption, as: "options" },
      ],
      order: [
        [{ model: IeltsSubQuestion, as: "questions" }, "order", "ASC"],
        [{ model: IeltsSubQuestion, as: "questions" }, "questionNumber", "ASC"],
        [{ model: IeltsQuestionOption, as: "options" }, "orderIndex", "ASC"],
      ],
    });
  }

  async findAllQuestions(query: QuestionQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      readingPartId,
      listeningPartId,
    } = query;
    const where: any = {};

    if (readingPartId) {
      where.reading_part_id = readingPartId;
    }
    if (listeningPartId) {
      where.listening_part_id = listeningPartId;
    }

    const { rows, count } = await this.ieltsQuestionModel.findAndCountAll({
      where,
      include: [
        { model: IeltsSubQuestion, as: "questions" },
        { model: IeltsQuestionOption, as: "options" },
      ],
      order: [
        ["questionNumber", "ASC"],
        [{ model: IeltsSubQuestion, as: "questions" }, "order", "ASC"],
        [{ model: IeltsSubQuestion, as: "questions" }, "questionNumber", "ASC"],
        [{ model: IeltsQuestionOption, as: "options" }, "orderIndex", "ASC"],
      ],
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

  async findQuestionById(id: string): Promise<IeltsQuestion> {
    const question = await this.ieltsQuestionModel.findByPk(id, {
      include: [
        { model: IeltsReadingPart, as: "readingPart" },
        { model: IeltsListeningPart, as: "listeningPart" },
        { model: IeltsSubQuestion, as: "questions" },
        { model: IeltsQuestionOption, as: "options" },
      ],
      order: [
        [{ model: IeltsSubQuestion, as: "questions" }, "order", "ASC"],
        [{ model: IeltsSubQuestion, as: "questions" }, "questionNumber", "ASC"],
        [{ model: IeltsQuestionOption, as: "options" }, "orderIndex", "ASC"],
      ],
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async updateQuestion(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<IeltsQuestion> {
    const { questions, options, ...questionData } = updateQuestionDto;
    const question = await this.findQuestionById(id);
    await question.update(questionData as any);

    if (questions !== undefined) {
      if (questions && questions.length > 0) {
        const incomingIds = questions
          .filter((sq: any) => sq.id)
          .map((sq: any) => sq.id);

        // Delete sub-questions that are no longer in the incoming array
        await this.ieltsSubQuestionModel.destroy({
          where: {
            question_id: id,
            ...(incomingIds.length > 0
              ? { id: { [Op.notIn]: incomingIds } }
              : {}),
          },
        });

        for (const sq of questions) {
          if (sq.id) {
            // Update existing sub-question
            await this.ieltsSubQuestionModel.update(
              { ...sq, question_id: id } as any,
              { where: { id: sq.id, question_id: id } },
            );
          } else {
            // Create new sub-question
            await this.ieltsSubQuestionModel.create({
              ...sq,
              question_id: id,
            } as any);
          }
        }
      } else {
        // Empty array means remove all sub-questions
        await this.ieltsSubQuestionModel.destroy({
          where: { question_id: id },
        });
      }
    }

    if (options !== undefined) {
      if (options && options.length > 0) {
        const incomingIds = options
          .filter((opt: any) => opt.id)
          .map((opt: any) => opt.id);

        // Delete options that are no longer in the incoming array
        await this.ieltsQuestionOptionModel.destroy({
          where: {
            question_id: id,
            ...(incomingIds.length > 0
              ? { id: { [Op.notIn]: incomingIds } }
              : {}),
          },
        });

        for (const opt of options) {
          if (opt.id) {
            // Update existing option
            await this.ieltsQuestionOptionModel.update(
              { ...opt, question_id: id } as any,
              { where: { id: opt.id, question_id: id } },
            );
          } else {
            // Create new option
            await this.ieltsQuestionOptionModel.create({
              ...opt,
              question_id: id,
            } as any);
          }
        }
      } else {
        // Empty array means remove all options
        await this.ieltsQuestionOptionModel.destroy({
          where: { question_id: id },
        });
      }
    }

    return this.sortQuestionsHeadingOptions(await this.findQuestionById(id));
  }

  async deleteQuestion(id: string): Promise<void> {
    const question = await this.findQuestionById(id);
    await question.destroy();
  }

  // ========== Question Options ==========
  async createQuestionOption(
    createQuestionOptionDto: CreateQuestionOptionDto,
  ): Promise<IeltsQuestionOption> {
    return await this.ieltsQuestionOptionModel.create(
      createQuestionOptionDto as any,
    );
  }

  async findAllQuestionOptions(query: QuestionOptionQueryDto) {
    const { page = 1, limit = 10, questionId } = query;
    const where: any = {};

    if (questionId) {
      where.question_id = questionId;
    }

    const { rows, count } = await this.ieltsQuestionOptionModel.findAndCountAll(
      {
        where,
        order: [
          ["orderIndex", "ASC"],
          ["createdAt", "DESC"],
        ],
        limit,
        offset: (page - 1) * limit,
      },
    );

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findQuestionOptionById(id: string): Promise<IeltsQuestionOption> {
    const option = await this.ieltsQuestionOptionModel.findByPk(id, {
      include: [{ model: IeltsQuestion, as: "question" }],
    });

    if (!option) {
      throw new NotFoundException(`Question option with ID ${id} not found`);
    }

    return option;
  }

  async updateQuestionOption(
    id: string,
    updateQuestionOptionDto: UpdateQuestionOptionDto,
  ): Promise<IeltsQuestionOption> {
    const option = await this.findQuestionOptionById(id);
    await option.update(updateQuestionOptionDto as any);
    return option;
  }

  async deleteQuestionOption(id: string): Promise<void> {
    const option = await this.findQuestionOptionById(id);
    await option.destroy();
  }

  // ========== Sub Questions ==========
  async createSubQuestion(
    createSubQuestionDto: CreateSubQuestionDto,
  ): Promise<IeltsSubQuestion> {
    return await this.ieltsSubQuestionModel.create(createSubQuestionDto as any);
  }

  async findAllSubQuestions(query: SubQuestionQueryDto) {
    const { page = 1, limit = 10, search, questionId } = query;
    const where: any = {};

    if (questionId) {
      where.question_id = questionId;
    }
    if (search) {
      where.questionText = { [Op.like]: `%${search}%` };
    }

    const { rows, count } = await this.ieltsSubQuestionModel.findAndCountAll({
      where,
      order: [
        ["order", "ASC"],
        ["createdAt", "DESC"],
      ],
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

  async findSubQuestionById(id: string): Promise<IeltsSubQuestion> {
    const subQuestion = await this.ieltsSubQuestionModel.findByPk(id, {
      include: [{ model: IeltsQuestion, as: "question" }],
    });

    if (!subQuestion) {
      throw new NotFoundException(`Sub question with ID ${id} not found`);
    }

    return subQuestion;
  }

  async updateSubQuestion(
    id: string,
    updateDto: UpdateSubQuestionDto,
  ): Promise<IeltsSubQuestion> {
    const subQuestion = await this.findSubQuestionById(id);
    await subQuestion.update(updateDto as any);
    return subQuestion;
  }

  async deleteSubQuestion(id: string): Promise<void> {
    const subQuestion = await this.findSubQuestionById(id);
    await subQuestion.destroy();
  }

  // ========== Many-to-Many: Reading ↔ Reading Parts ==========
  async linkReadingPart(
    dto: LinkReadingPartDto,
  ): Promise<IeltsReadingReadingPart> {
    const existing = await this.ieltsReadingReadingPartModel.findOne({
      where: {
        reading_id: dto.reading_id,
        reading_part_id: dto.reading_part_id,
      },
    });
    if (existing) {
      throw new ConflictException(
        "This reading part is already linked to the reading section.",
      );
    }
    return await this.ieltsReadingReadingPartModel.create(dto as any);
  }

  async unlinkReadingPart(dto: UnlinkReadingPartDto): Promise<void> {
    const deleted = await this.ieltsReadingReadingPartModel.destroy({
      where: {
        reading_id: dto.reading_id,
        reading_part_id: dto.reading_part_id,
      },
    });
    if (!deleted) {
      throw new NotFoundException("Link not found.");
    }
  }

  async getLinkedReadingParts(readingId: string) {
    const reading = await this.ieltsReadingModel.findByPk(readingId, {
      include: [
        {
          model: IeltsReadingPart,
          as: "linkedParts",
          through: { attributes: ["id", "order"] },
        },
      ],
      order: [
        [
          { model: IeltsReadingPart, as: "linkedParts" },
          IeltsReadingReadingPart,
          "order",
          "ASC",
        ],
      ],
    });
    if (!reading) {
      throw new NotFoundException(`Reading with ID ${readingId} not found`);
    }
    return (reading as any).linkedParts || [];
  }

  // ========== Many-to-Many: Listening ↔ Listening Parts ==========
  async linkListeningPart(
    dto: LinkListeningPartDto,
  ): Promise<IeltsListeningListeningPart> {
    const existing = await this.ieltsListeningListeningPartModel.findOne({
      where: {
        listening_id: dto.listening_id,
        listening_part_id: dto.listening_part_id,
      },
    });
    if (existing) {
      throw new ConflictException(
        "This listening part is already linked to the listening section.",
      );
    }
    return await this.ieltsListeningListeningPartModel.create(dto as any);
  }

  async unlinkListeningPart(dto: UnlinkListeningPartDto): Promise<void> {
    const deleted = await this.ieltsListeningListeningPartModel.destroy({
      where: {
        listening_id: dto.listening_id,
        listening_part_id: dto.listening_part_id,
      },
    });
    if (!deleted) {
      throw new NotFoundException("Link not found.");
    }
  }

  async getLinkedListeningParts(listeningId: string) {
    const listening = await this.ieltsListeningModel.findByPk(listeningId, {
      include: [
        {
          model: IeltsListeningPart,
          as: "linkedParts",
          through: { attributes: ["id", "order"] },
        },
      ],
      order: [
        [
          { model: IeltsListeningPart, as: "linkedParts" },
          IeltsListeningListeningPart,
          "order",
          "ASC",
        ],
      ],
    });
    if (!listening) {
      throw new NotFoundException(`Listening with ID ${listeningId} not found`);
    }
    return (listening as any).linkedParts || [];
  }

  // ========== Many-to-Many: Writing ↔ Writing Tasks ==========
  async linkWritingTask(
    dto: LinkWritingTaskDto,
  ): Promise<IeltsWritingWritingTask> {
    const existing = await this.ieltsWritingWritingTaskModel.findOne({
      where: {
        writing_id: dto.writing_id,
        writing_task_id: dto.writing_task_id,
      },
    });
    if (existing) {
      throw new ConflictException(
        "This writing task is already linked to the writing section.",
      );
    }
    return await this.ieltsWritingWritingTaskModel.create(dto as any);
  }

  async unlinkWritingTask(dto: UnlinkWritingTaskDto): Promise<void> {
    const deleted = await this.ieltsWritingWritingTaskModel.destroy({
      where: {
        writing_id: dto.writing_id,
        writing_task_id: dto.writing_task_id,
      },
    });
    if (!deleted) {
      throw new NotFoundException("Link not found.");
    }
  }

  async getLinkedWritingTasks(writingId: string) {
    const writing = await this.ieltsWritingModel.findByPk(writingId, {
      include: [
        {
          model: IeltsWritingTask,
          as: "linkedTasks",
          through: { attributes: ["id", "order"] },
        },
      ],
      order: [
        [
          { model: IeltsWritingTask, as: "linkedTasks" },
          IeltsWritingWritingTask,
          "order",
          "ASC",
        ],
      ],
    });
    if (!writing) {
      throw new NotFoundException(`Writing with ID ${writingId} not found`);
    }
    return (writing as any).linkedTasks || [];
  }

  // ========== Download Full Test as JSON ==========
  async downloadFullTestAsJson(testId: string) {
    const test = await this.ieltsTestModel.findByPk(testId);
    if (!test) {
      throw new NotFoundException(`Test with ID ${testId} not found`);
    }

    const readings = await this.ieltsReadingModel.findAll({
      where: { test_id: testId },
      order: [["orderId", "ASC"]],
    });

    const listenings = await this.ieltsListeningModel.findAll({
      where: { test_id: testId },
      order: [["orderId", "ASC"]],
    });

    const writings = await this.ieltsWritingModel.findAll({
      where: { test_id: testId },
      order: [["orderId", "ASC"]],
    });

    const readingParts: any[] = [];
    for (const reading of readings) {
      const parts = await this.ieltsReadingPartModel.findAll({
        where: { reading_id: reading.id },
        include: [
          {
            model: IeltsQuestion,
            as: "questions",
            include: [
              { model: IeltsSubQuestion, as: "questions" },
              { model: IeltsQuestionOption, as: "options" },
            ],
          },
        ],
        order: [
          ["part", "ASC"],
          [{ model: IeltsQuestion, as: "questions" }, "questionNumber", "ASC"],
          [
            { model: IeltsQuestion, as: "questions" },
            { model: IeltsSubQuestion, as: "questions" },
            "order",
            "ASC",
          ],
          [
            { model: IeltsQuestion, as: "questions" },
            { model: IeltsQuestionOption, as: "options" },
            "orderIndex",
            "ASC",
          ],
        ],
      });

      for (const part of parts) {
        const partJson = part.toJSON() as any;
        partJson.reading_id = reading.id;

        partJson.questions = (partJson.questions || []).map((q: any) => {
          const question: any = {
            questionNumber: q.questionNumber,
            type: q.type,
            instruction: q.instruction,
          };

          if (q.questionText) question.questionText = q.questionText;
          if (q.headingOptions) question.headingOptions = q.headingOptions;
          if (q.tableData) question.tableData = q.tableData;
          if (q.points != null) question.points = q.points;
          if (q.isActive != null) question.isActive = q.isActive;

          if (q.options && q.options.length > 0) {
            question.options = q.options.map((opt: any) => ({
              optionKey: opt.optionKey,
              optionText: opt.optionText,
              isCorrect: opt.isCorrect,
              orderIndex: opt.orderIndex,
              ...(opt.explanation ? { explanation: opt.explanation } : {}),
              ...(opt.fromPassage ? { fromPassage: opt.fromPassage } : {}),
            }));
          }

          if (q.questions && q.questions.length > 0) {
            question.questions = q.questions.map((sq: any) => ({
              questionNumber: sq.questionNumber,
              questionText: sq.questionText,
              correctAnswer: sq.correctAnswer,
              points: sq.points,
              ...(sq.explanation ? { explanation: sq.explanation } : {}),
              ...(sq.fromPassage ? { fromPassage: sq.fromPassage } : {}),
              order: sq.order,
            }));
          }

          return question;
        });

        readingParts.push({
          reading_id: reading.id,
          part: partJson.part,
          mode: partJson.mode,
          title: partJson.title,
          content: partJson.content,
          timeLimitMinutes: partJson.timeLimitMinutes,
          difficulty: partJson.difficulty,
          isActive: partJson.isActive,
          totalQuestions: partJson.totalQuestions,
          questions: partJson.questions,
        });
      }
    }

    const listeningParts: any[] = [];
    for (const listening of listenings) {
      const parts = await this.ieltsListeningPartModel.findAll({
        where: { listening_id: listening.id },
        include: [
          {
            model: IeltsQuestion,
            as: "questions",
            include: [
              { model: IeltsSubQuestion, as: "questions" },
              { model: IeltsQuestionOption, as: "options" },
            ],
          },
        ],
        order: [
          ["part", "ASC"],
          [{ model: IeltsQuestion, as: "questions" }, "questionNumber", "ASC"],
          [
            { model: IeltsQuestion, as: "questions" },
            { model: IeltsSubQuestion, as: "questions" },
            "order",
            "ASC",
          ],
          [
            { model: IeltsQuestion, as: "questions" },
            { model: IeltsQuestionOption, as: "options" },
            "orderIndex",
            "ASC",
          ],
        ],
      });

      for (const part of parts) {
        const partJson = part.toJSON() as any;

        partJson.questions = (partJson.questions || []).map((q: any) => {
          const question: any = {
            questionNumber: q.questionNumber,
            type: q.type,
            instruction: q.instruction,
          };

          if (q.questionText) question.questionText = q.questionText;
          if (q.headingOptions) question.headingOptions = q.headingOptions;
          if (q.tableData) question.tableData = q.tableData;
          if (q.points != null) question.points = q.points;
          if (q.isActive != null) question.isActive = q.isActive;

          if (q.options && q.options.length > 0) {
            question.options = q.options.map((opt: any) => ({
              optionKey: opt.optionKey,
              optionText: opt.optionText,
              isCorrect: opt.isCorrect,
              orderIndex: opt.orderIndex,
              ...(opt.explanation ? { explanation: opt.explanation } : {}),
              ...(opt.fromPassage ? { fromPassage: opt.fromPassage } : {}),
            }));
          }

          if (q.questions && q.questions.length > 0) {
            question.questions = q.questions.map((sq: any) => ({
              questionNumber: sq.questionNumber,
              questionText: sq.questionText,
              correctAnswer: sq.correctAnswer,
              points: sq.points,
              ...(sq.explanation ? { explanation: sq.explanation } : {}),
              ...(sq.fromPassage ? { fromPassage: sq.fromPassage } : {}),
              order: sq.order,
            }));
          }

          return question;
        });

        listeningParts.push({
          listening_id: listening.id,
          part: partJson.part,
          mode: partJson.mode,
          title: partJson.title,
          audio: partJson.audio ?? {
            url: partJson.audio_url,
            file_name: partJson.audio_file_name,
            duration: partJson.audio_duration,
          },
          timeLimitMinutes: partJson.timeLimitMinutes,
          difficulty: partJson.difficulty,
          isActive: partJson.isActive,
          totalQuestions: partJson.totalQuestions,
          questions: partJson.questions,
        });
      }
    }

    const writingTasks: any[] = [];
    for (const writing of writings) {
      const tasks = await this.ieltsWritingTaskModel.findAll({
        where: { writing_id: writing.id },
        order: [["task", "ASC"]],
      });

      for (const task of tasks) {
        const taskJson = task.toJSON() as any;
        writingTasks.push({
          writing_id: writing.id,
          task: taskJson.task,
          mode: taskJson.mode,
          prompt: taskJson.prompt,
          ...(taskJson.image_url ? { image_url: taskJson.image_url } : {}),
          min_words: taskJson.min_words,
          suggested_time: taskJson.suggested_time,
        });
      }
    }

    const testJson = test.toJSON() as any;

    const result: any = {
      test: {
        title: testJson.title,
        mode: testJson.mode,
        status: testJson.status,
        category: testJson.category,
      },
    };

    if (readings.length > 0) {
      const readingJson = readings[0].toJSON() as any;
      result.reading = {
        id: readingJson.id,
        title: readingJson.title,
        test_id: readingJson.test_id,
      };
    }

    if (listenings.length > 0) {
      const listeningJson = listenings[0].toJSON() as any;
      result.listening = {
        id: listeningJson.id,
        title: listeningJson.title,
        description: listeningJson.description,
        test_id: listeningJson.test_id,
        full_audio_url: listeningJson.full_audio_url,
        is_active: listeningJson.is_active,
      };
    }

    if (writings.length > 0) {
      const writingJson = writings[0].toJSON() as any;
      result.writing = {
        id: writingJson.id,
        title: writingJson.title,
        description: writingJson.description,
        test_id: writingJson.test_id,
        is_active: writingJson.is_active,
      };
    }

    if (readingParts.length > 0) {
      result.readingParts = readingParts;
    }

    if (listeningParts.length > 0) {
      result.listeningParts = listeningParts;
    }

    if (writingTasks.length > 0) {
      result.writingTasks = writingTasks;
    }

    return result;
  }
}
