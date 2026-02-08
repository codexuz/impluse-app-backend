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
import { IeltsQuestionContent } from "./entities/ielts-question-content.entity.js";
import { IeltsQuestionOption } from "./entities/ielts-question-option.entity.js";
import { IeltsMultipleChoiceQuestion } from "./entities/ielts-multiple-choice-question.entity.js";
import { IeltsMultipleChoiceOption } from "./entities/ielts-multiple-choice-option.entity.js";
import { CreateTestDto } from "./dto/create-test.dto.js";
import { UpdateTestDto } from "./dto/update-test.dto.js";
import { CreateReadingDto } from "./dto/create-reading.dto.js";
import { UpdateReadingDto } from "./dto/update-reading.dto.js";
import { CreateReadingPartDto } from "./dto/create-reading-part.dto.js";
import { CreateListeningDto } from "./dto/create-listening.dto.js";
import { CreateListeningPartDto } from "./dto/create-listening-part.dto.js";
import { CreateWritingDto } from "./dto/create-writing.dto.js";
import { CreateWritingTaskDto } from "./dto/create-writing-task.dto.js";
import { CreateAudioDto } from "./dto/create-audio.dto.js";
import { CreateQuestionDto } from "./dto/create-question.dto.js";
import { CreateQuestionContentDto } from "./dto/create-question-content.dto.js";
import { CreateQuestionOptionDto } from "./dto/create-question-option.dto.js";
import { CreateMultipleChoiceQuestionDto } from "./dto/create-multiple-choice-question.dto.js";
import { CreateMultipleChoiceOptionDto } from "./dto/create-multiple-choice-option.dto.js";
import { UpdateReadingPartDto } from "./dto/update-reading-part.dto.js";
import { UpdateListeningPartDto } from "./dto/update-listening-part.dto.js";
import {
  TestQueryDto,
  ReadingQueryDto,
  ListeningQueryDto,
  WritingQueryDto,
  ReadingPartQueryDto,
  ListeningPartQueryDto,
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
    @InjectModel(IeltsQuestionContent)
    private readonly ieltsQuestionContentModel: typeof IeltsQuestionContent,
    @InjectModel(IeltsQuestionOption)
    private readonly ieltsQuestionOptionModel: typeof IeltsQuestionOption,
    @InjectModel(IeltsMultipleChoiceQuestion)
    private readonly ieltsMultipleChoiceQuestionModel: typeof IeltsMultipleChoiceQuestion,
    @InjectModel(IeltsMultipleChoiceOption)
    private readonly ieltsMultipleChoiceOptionModel: typeof IeltsMultipleChoiceOption,
  ) {}

  // ========== Tests ==========
  async createTest(createTestDto: CreateTestDto): Promise<IeltsTest> {
    return await this.ieltsTestModel.create(createTestDto as any);
  }

  async findAllTests(query: TestQueryDto) {
    const { page = 1, limit = 10, search, mode, status } = query;
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
                {
                  model: IeltsQuestionContent,
                  as: "contents",
                  include: [
                    { model: IeltsQuestionOption, as: "options" },
                    {
                      model: IeltsMultipleChoiceQuestion,
                      as: "multipleChoiceQuestions",
                      include: [
                        { model: IeltsMultipleChoiceOption, as: "options" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
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
              {
                model: IeltsQuestionContent,
                as: "contents",
                include: [
                  { model: IeltsQuestionOption, as: "options" },
                  {
                    model: IeltsMultipleChoiceQuestion,
                    as: "multipleChoiceQuestions",
                    include: [
                      { model: IeltsMultipleChoiceOption, as: "options" },
                    ],
                  },
                ],
              },
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
                {
                  model: IeltsQuestionContent,
                  as: "contents",
                  include: [
                    { model: IeltsQuestionOption, as: "options" },
                    {
                      model: IeltsMultipleChoiceQuestion,
                      as: "multipleChoiceQuestions",
                      include: [
                        { model: IeltsMultipleChoiceOption, as: "options" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!listening) {
      throw new NotFoundException(`Listening with ID ${id} not found`);
    }

    return listening;
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
              {
                model: IeltsQuestionContent,
                as: "contents",
                include: [
                  { model: IeltsQuestionOption, as: "options" },
                  {
                    model: IeltsMultipleChoiceQuestion,
                    as: "multipleChoiceQuestions",
                    include: [
                      { model: IeltsMultipleChoiceOption, as: "options" },
                    ],
                  },
                ],
              },
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

  // ========== Writing Tasks ==========
  async createWritingTask(
    createWritingTaskDto: CreateWritingTaskDto,
  ): Promise<IeltsWritingTask> {
    return await this.ieltsWritingTaskModel.create(createWritingTaskDto as any);
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
    return await this.ieltsQuestionModel.create(createQuestionDto as any);
  }

  async findQuestionById(id: string): Promise<IeltsQuestion> {
    const question = await this.ieltsQuestionModel.findByPk(id, {
      include: [
        { model: IeltsReadingPart, as: "readingPart" },
        { model: IeltsListeningPart, as: "listeningPart" },
        { model: IeltsQuestionContent, as: "contents" },
      ],
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  // ========== Question Contents ==========
  async createQuestionContent(
    createQuestionContentDto: CreateQuestionContentDto,
  ): Promise<IeltsQuestionContent> {
    return await this.ieltsQuestionContentModel.create(
      createQuestionContentDto as any,
    );
  }

  async findQuestionContentById(id: string): Promise<IeltsQuestionContent> {
    const content = await this.ieltsQuestionContentModel.findByPk(id, {
      include: [
        { model: IeltsQuestion, as: "question" },
        { model: IeltsQuestionOption, as: "options" },
        { model: IeltsMultipleChoiceQuestion, as: "multipleChoiceQuestions" },
      ],
    });

    if (!content) {
      throw new NotFoundException(`Question content with ID ${id} not found`);
    }

    return content;
  }

  // ========== Question Options ==========
  async createQuestionOption(
    createQuestionOptionDto: CreateQuestionOptionDto,
  ): Promise<IeltsQuestionOption> {
    return await this.ieltsQuestionOptionModel.create(
      createQuestionOptionDto as any,
    );
  }

  // ========== Multiple Choice Questions ==========
  async createMultipleChoiceQuestion(
    createMultipleChoiceQuestionDto: CreateMultipleChoiceQuestionDto,
  ): Promise<IeltsMultipleChoiceQuestion> {
    return await this.ieltsMultipleChoiceQuestionModel.create(
      createMultipleChoiceQuestionDto as any,
    );
  }

  async findMultipleChoiceQuestionById(
    id: string,
  ): Promise<IeltsMultipleChoiceQuestion> {
    const mcq = await this.ieltsMultipleChoiceQuestionModel.findByPk(id, {
      include: [
        { model: IeltsQuestionContent, as: "questionContent" },
        { model: IeltsMultipleChoiceOption, as: "options" },
      ],
    });

    if (!mcq) {
      throw new NotFoundException(
        `Multiple choice question with ID ${id} not found`,
      );
    }

    return mcq;
  }

  // ========== Multiple Choice Options ==========
  async createMultipleChoiceOption(
    createMultipleChoiceOptionDto: CreateMultipleChoiceOptionDto,
  ): Promise<IeltsMultipleChoiceOption> {
    return await this.ieltsMultipleChoiceOptionModel.create(
      createMultipleChoiceOptionDto as any,
    );
  }
}
