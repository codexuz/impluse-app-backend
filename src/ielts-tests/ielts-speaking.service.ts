import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { IeltsSpeaking } from "./entities/ielts-speaking.entity.js";
import {
  IeltsSpeakingPart,
} from "./entities/ielts-speaking-part.entity.js";
import { IeltsSpeakingQuestion } from "./entities/ielts-speaking-question.entity.js";
import { IeltsSpeakingAttempt } from "./entities/ielts-speaking-attempt.entity.js";
import { IeltsTest } from "./entities/ielts-test.entity.js";
import {
  BulkCreateSpeakingQuestionsDto,
  CreateSpeakingDto,
  CreateSpeakingPartDto,
  CreateSpeakingQuestionDto,
  SpeakingAttemptQueryDto,
  SpeakingPartQueryDto,
  SpeakingQueryDto,
  SpeakingQuestionQueryDto,
  UpdateSpeakingDto,
  UpdateSpeakingPartDto,
  UpdateSpeakingQuestionDto,
} from "./dto/speaking.dto.js";

// Roles allowed to view any candidate's attempts (not just their own).
const PRIVILEGED_ROLES = ["admin", "owner", "manager", "teacher", "support_teacher"];

@Injectable()
export class IeltsSpeakingService {
  constructor(
    @InjectModel(IeltsSpeaking)
    private readonly speakingModel: typeof IeltsSpeaking,
    @InjectModel(IeltsSpeakingPart)
    private readonly partModel: typeof IeltsSpeakingPart,
    @InjectModel(IeltsSpeakingQuestion)
    private readonly questionModel: typeof IeltsSpeakingQuestion,
    @InjectModel(IeltsSpeakingAttempt)
    private readonly attemptModel: typeof IeltsSpeakingAttempt,
  ) {}

  // ==================== Topics ====================

  async createSpeaking(dto: CreateSpeakingDto): Promise<IeltsSpeaking> {
    return this.speakingModel.create(dto as any);
  }

  async findAllSpeakings(query: SpeakingQueryDto) {
    const { page = 1, limit = 10, search, testId, mode, isActive } = query;
    const where: any = {};
    if (search) where.title = { [Op.like]: `%${search}%` };
    if (testId) where.test_id = testId;
    if (mode) where.mode = mode;
    if (isActive !== undefined) where.is_active = isActive;

    const { rows, count } = await this.speakingModel.findAndCountAll({
      where,
      include: [{ model: IeltsTest, as: "test", required: false }],
      order: [["orderId", "ASC"]],
      limit,
      offset: (page - 1) * limit,
    });

    return { data: rows, total: count, page, limit };
  }

  /** A topic with its parts and questions, ordered for examiner playback. */
  async findSpeakingById(id: string): Promise<IeltsSpeaking> {
    const speaking = await this.speakingModel.findByPk(id, {
      include: [
        {
          model: IeltsSpeakingPart,
          as: "parts",
          include: [{ model: IeltsSpeakingQuestion, as: "questions" }],
        },
      ],
      order: [
        [{ model: IeltsSpeakingPart, as: "parts" }, "order", "ASC"],
        [
          { model: IeltsSpeakingPart, as: "parts" },
          { model: IeltsSpeakingQuestion, as: "questions" },
          "order",
          "ASC",
        ],
      ],
    });
    if (!speaking) throw new NotFoundException("Speaking topic not found");
    return speaking;
  }

  async updateSpeaking(id: string, dto: UpdateSpeakingDto): Promise<IeltsSpeaking> {
    const speaking = await this.speakingModel.findByPk(id);
    if (!speaking) throw new NotFoundException("Speaking topic not found");
    await speaking.update(dto as any);
    return speaking;
  }

  async deleteSpeaking(id: string): Promise<void> {
    const speaking = await this.speakingModel.findByPk(id);
    if (!speaking) throw new NotFoundException("Speaking topic not found");
    await speaking.destroy();
  }

  // ==================== Parts ====================

  async createPart(dto: CreateSpeakingPartDto): Promise<IeltsSpeakingPart> {
    await this.assertSpeakingExists(dto.speaking_id);
    return this.partModel.create(dto as any);
  }

  async findAllParts(query: SpeakingPartQueryDto) {
    const { page = 1, limit = 10, speakingId, part } = query;
    const where: any = {};
    if (speakingId) where.speaking_id = speakingId;
    if (part) where.part = part;

    const { rows, count } = await this.partModel.findAndCountAll({
      where,
      include: [{ model: IeltsSpeakingQuestion, as: "questions" }],
      order: [["order", "ASC"]],
      limit,
      offset: (page - 1) * limit,
    });

    return { data: rows, total: count, page, limit };
  }

  async findPartById(id: string): Promise<IeltsSpeakingPart> {
    const part = await this.partModel.findByPk(id, {
      include: [{ model: IeltsSpeakingQuestion, as: "questions" }],
      order: [[{ model: IeltsSpeakingQuestion, as: "questions" }, "order", "ASC"]],
    });
    if (!part) throw new NotFoundException("Speaking part not found");
    return part;
  }

  async updatePart(id: string, dto: UpdateSpeakingPartDto): Promise<IeltsSpeakingPart> {
    const part = await this.partModel.findByPk(id);
    if (!part) throw new NotFoundException("Speaking part not found");
    await part.update(dto as any);
    return part;
  }

  async deletePart(id: string): Promise<void> {
    const part = await this.partModel.findByPk(id);
    if (!part) throw new NotFoundException("Speaking part not found");
    await part.destroy();
  }

  // ==================== Questions ====================

  async createQuestion(dto: CreateSpeakingQuestionDto): Promise<IeltsSpeakingQuestion> {
    await this.assertPartExists(dto.part_id);
    return this.questionModel.create(dto as any);
  }

  async bulkCreateQuestions(
    dto: BulkCreateSpeakingQuestionsDto,
  ): Promise<IeltsSpeakingQuestion[]> {
    await this.assertPartExists(dto.part_id);
    const rows = dto.questions.map((q, i) => ({
      part_id: dto.part_id,
      question_text: q.question_text,
      order: q.order ?? i,
    }));
    return this.questionModel.bulkCreate(rows as any);
  }

  async findAllQuestions(query: SpeakingQuestionQueryDto) {
    const { page = 1, limit = 50, partId } = query;
    const where: any = {};
    if (partId) where.part_id = partId;

    const { rows, count } = await this.questionModel.findAndCountAll({
      where,
      order: [["order", "ASC"]],
      limit,
      offset: (page - 1) * limit,
    });

    return { data: rows, total: count, page, limit };
  }

  async updateQuestion(
    id: string,
    dto: UpdateSpeakingQuestionDto,
  ): Promise<IeltsSpeakingQuestion> {
    const question = await this.questionModel.findByPk(id);
    if (!question) throw new NotFoundException("Speaking question not found");
    await question.update(dto as any);
    return question;
  }

  async deleteQuestion(id: string): Promise<void> {
    const question = await this.questionModel.findByPk(id);
    if (!question) throw new NotFoundException("Speaking question not found");
    await question.destroy();
  }

  // ==================== Attempts ====================

  /** A user's own past speaking attempts (newest first), with topic title. */
  async getMyAttempts(userId: string, query: SpeakingAttemptQueryDto) {
    const { page = 1, limit = 10, speakingId } = query;
    const where: any = { user_id: userId };
    if (speakingId) where.speaking_id = speakingId;

    const { rows, count } = await this.attemptModel.findAndCountAll({
      where,
      include: [
        {
          model: IeltsSpeaking,
          as: "speaking",
          attributes: ["id", "title"],
          required: false,
        },
      ],
      order: [["started_at", "DESC"]],
      limit,
      offset: (page - 1) * limit,
    });

    return {
      data: rows.map((r) => this.mapAttempt(r)),
      total: count,
      page,
      limit,
    };
  }

  /**
   * A single attempt with its transcript and parsed feedback. Owners can always
   * read their own; privileged roles (teacher/admin/…) can read any.
   */
  async getAttemptById(id: string, userId: string, roles: string[] = []) {
    const attempt = await this.attemptModel.findByPk(id, {
      include: [
        {
          model: IeltsSpeaking,
          as: "speaking",
          attributes: ["id", "title"],
          required: false,
        },
      ],
    });
    if (!attempt) throw new NotFoundException("Speaking attempt not found");

    const isOwner = attempt.user_id === userId;
    const isPrivileged = roles.some((r) => PRIVILEGED_ROLES.includes(r));
    if (!isOwner && !isPrivileged) {
      throw new ForbiddenException("You cannot view this attempt");
    }

    return this.mapAttempt(attempt);
  }

  /** Shape an attempt row, parsing the stored feedback JSON into an object. */
  private mapAttempt(attempt: IeltsSpeakingAttempt) {
    const json = attempt.toJSON() as any;
    let feedback: unknown = null;
    if (json.feedback) {
      try {
        feedback = JSON.parse(json.feedback);
      } catch {
        feedback = json.feedback; // fall back to raw text if not valid JSON
      }
    }
    return { ...json, feedback };
  }

  // ==================== Helpers ====================

  private async assertSpeakingExists(id: string): Promise<void> {
    const exists = await this.speakingModel.findByPk(id, { attributes: ["id"] });
    if (!exists) throw new NotFoundException("Speaking topic not found");
  }

  private async assertPartExists(id: string): Promise<void> {
    const exists = await this.partModel.findByPk(id, { attributes: ["id"] });
    if (!exists) throw new NotFoundException("Speaking part not found");
  }
}
