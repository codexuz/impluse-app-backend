import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IeltsTest } from "./entities/ielts-test.entity.js";
import { IeltsReading } from "./entities/ielts-reading.entity.js";
import { IeltsReadingPart } from "./entities/ielts-reading-part.entity.js";
import { IeltsListening } from "./entities/ielts-listening.entity.js";
import { IeltsListeningPart } from "./entities/ielts-listening-part.entity.js";
import { IeltsWriting } from "./entities/ielts-writing.entity.js";
import { IeltsWritingTask } from "./entities/ielts-writing-task.entity.js";
import { IeltsAudio } from "./entities/ielts-audio.entity.js";
import { IeltsQuestion } from "./entities/ielts-question.entity.js";
import { IeltsQuestionOption } from "./entities/ielts-question-option.entity.js";
import { IeltsSubQuestion } from "./entities/ielts-multiple-choice-question.entity.js";
import { CreateTestDto } from "./dto/create-test.dto.js";
import { UpdateTestDto } from "./dto/update-test.dto.js";
import { CreateReadingDto } from "./dto/create-reading.dto.js";
import { UpdateReadingDto } from "./dto/update-reading.dto.js";
import { CreateReadingPartDto } from "./dto/create-reading-part.dto.js";
import { CreateListeningDto } from "./dto/create-listening.dto.js";
import { CreateListeningPartDto } from "./dto/create-listening-part.dto.js";
import { CreateWritingDto } from "./dto/create-writing.dto.js";
import { CreateWritingTaskDto } from "./dto/create-writing-task.dto.js";
import { UpdateWritingDto } from "./dto/update-writing.dto.js";
import { UpdateWritingTaskDto } from "./dto/update-writing-task.dto.js";
import { CreateAudioDto } from "./dto/create-audio.dto.js";
import { CreateQuestionDto } from "./dto/create-question.dto.js";
import { CreateQuestionOptionDto } from "./dto/create-question-option.dto.js";
import { CreateSubQuestionDto } from "./dto/create-multiple-choice-question.dto.js";
import { UpdateReadingPartDto } from "./dto/update-reading-part.dto.js";
import { UpdateListeningPartDto } from "./dto/update-listening-part.dto.js";
import { UpdateQuestionDto } from "./dto/update-question.dto.js";
import { UpdateQuestionOptionDto } from "./dto/update-question-option.dto.js";
import { UpdateSubQuestionDto } from "./dto/update-multiple-choice-question.dto.js";
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
} from "./dto/query.dto.js";
import { User } from "../users/entities/user.entity.js";
import { Op } from "sequelize";

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
    @InjectModel(IeltsAudio)
    private readonly ieltsAudioModel: typeof IeltsAudio,
    @InjectModel(IeltsQuestion)
    private readonly ieltsQuestionModel: typeof IeltsQuestion,
    @InjectModel(IeltsQuestionOption)
    private readonly ieltsQuestionOptionModel: typeof IeltsQuestionOption,
    @InjectModel(IeltsSubQuestion)
    private readonly ieltsSubQuestionModel: typeof IeltsSubQuestion,
  ) {}

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

  async findTestById(id: string): Promise<IeltsTest> {
    const test = await this.ieltsTestModel.findByPk(id, {
      include: [{ model: User, as: "creator" }],
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
      order: [["createdAt", "DESC"]],
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

    return reading;
  }

  async updateReading(
    id: string,
    updateReadingDto: UpdateReadingDto,
  ): Promise<IeltsReading> {
    const reading = await this.findReadingById(id);
    await reading.update(updateReadingDto);
    return reading;
  }

  async deleteReading(id: string): Promise<void> {
    const reading = await this.findReadingById(id);
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
    const { page = 1, limit = 10, search, readingId, part } = query;
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
        { model: IeltsQuestion, as: "questions" },
      ],
      order: [
        [{ model: IeltsQuestion, as: "questions" }, "questionNumber", "ASC"],
      ],
    });

    if (!part) {
      throw new NotFoundException(`Reading part with ID ${id} not found`);
    }

    return part;
  }

  async updateReadingPart(
    id: string,
    updateReadingPartDto: UpdateReadingPartDto,
  ): Promise<IeltsReadingPart> {
    const part = await this.findReadingPartById(id);
    await part.update(updateReadingPartDto as any);
    return part;
  }

  async deleteReadingPart(id: string): Promise<void> {
    const part = await this.findReadingPartById(id);
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

  async findListeningById(id: string): Promise<IeltsListening> {
    const listening = await this.ieltsListeningModel.findByPk(id, {
      include: [
        { model: IeltsTest, as: "test" },
        {
          model: IeltsListeningPart,
          as: "parts",
          include: [
            { model: IeltsAudio, as: "audio" },
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

    return listening;
  }

  async deleteListening(id: string): Promise<void> {
    const listening = await this.findListeningById(id);
    await listening.destroy();
  }

  // ========== Listening Parts ==========
  async createListeningPart(
    createListeningPartDto: CreateListeningPartDto,
  ): Promise<IeltsListeningPart> {
    return await this.ieltsListeningPartModel.create(
      createListeningPartDto as any,
      {
        include: [
          { model: IeltsAudio, as: "audio" },
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

  async findAllListeningParts(query: ListeningPartQueryDto) {
    const { page = 1, limit = 10, search, listeningId, part } = query;
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

    const { rows, count } = await this.ieltsListeningPartModel.findAndCountAll({
      where,
      include: [
        { model: IeltsListening, as: "listening" },
        { model: IeltsAudio, as: "audio" },
      ],
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
        { model: IeltsQuestion, as: "questions" },
        { model: IeltsAudio, as: "audio" },
      ],
      order: [
        [{ model: IeltsQuestion, as: "questions" }, "questionNumber", "ASC"],
      ],
    });

    if (!part) {
      throw new NotFoundException(`Listening part with ID ${id} not found`);
    }

    return part;
  }

  async updateListeningPart(
    id: string,
    updateListeningPartDto: UpdateListeningPartDto,
  ): Promise<IeltsListeningPart> {
    const part = await this.findListeningPartById(id);
    await part.update(updateListeningPartDto as any);
    return part;
  }

  async deleteListeningPart(id: string): Promise<void> {
    const part = await this.findListeningPartById(id);
    await part.destroy();
  }

  // ========== Writing ==========
  async createWriting(
    createWritingDto: CreateWritingDto,
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
    updateWritingDto: UpdateWritingDto,
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
    const { page = 1, limit = 10, search, writingId, task } = query;
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

  // ========== Audio ==========
  async createAudio(createAudioDto: CreateAudioDto): Promise<IeltsAudio> {
    return await this.ieltsAudioModel.create(createAudioDto as any);
  }

  async findAllAudios(): Promise<IeltsAudio[]> {
    return await this.ieltsAudioModel.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  async findAudioById(id: string): Promise<IeltsAudio> {
    const audio = await this.ieltsAudioModel.findByPk(id);

    if (!audio) {
      throw new NotFoundException(`Audio with ID ${id} not found`);
    }

    return audio;
  }

  // ========== Questions ==========
  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<IeltsQuestion> {
    const { questions, ...questionData } = createQuestionDto;
    const question = await this.ieltsQuestionModel.create(questionData as any);

    if (questions && questions.length > 0) {
      const subQuestions = questions.map((sq) => ({
        ...sq,
        question_id: question.id,
      }));
      await this.ieltsSubQuestionModel.bulkCreate(subQuestions as any);
    }

    return await this.ieltsQuestionModel.findByPk(question.id, {
      include: [{ model: IeltsSubQuestion, as: "questions" }],
      order: [
        [{ model: IeltsSubQuestion, as: "questions" }, "order", "ASC"],
        [{ model: IeltsSubQuestion, as: "questions" }, "questionNumber", "ASC"],
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
    const { questions, ...questionData } = updateQuestionDto;
    const question = await this.findQuestionById(id);
    await question.update(questionData as any);

    if (questions !== undefined) {
      // Remove existing sub-questions and replace with new ones
      await this.ieltsSubQuestionModel.destroy({ where: { question_id: id } });
      if (questions && questions.length > 0) {
        const subQuestions = questions.map((sq) => ({
          ...sq,
          question_id: id,
        }));
        await this.ieltsSubQuestionModel.bulkCreate(subQuestions as any);
      }
    }

    return await this.findQuestionById(id);
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
}
