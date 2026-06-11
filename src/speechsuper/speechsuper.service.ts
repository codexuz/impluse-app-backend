import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import axios from "axios";
import { SpeechSuperTopic } from "./entities/speechsuper-topic.entity.js";
import { SpeechSuperQuestion } from "./entities/speechsuper-question.entity.js";
import { SpeechSuperAttempt } from "./entities/speechsuper-attempt.entity.js";
import { CreateTopicDto } from "./dto/create-topic.dto.js";
import { UpdateTopicDto } from "./dto/update-topic.dto.js";
import { CreateQuestionDto } from "./dto/create-question.dto.js";
import { UpdateQuestionDto } from "./dto/update-question.dto.js";
import { AssessDto } from "./dto/assess.dto.js";
import {
  SpeechSuperApiService,
  SpeechSuperRequestParams,
} from "./speechsuper-api.service.js";
import {
  CORE_TYPE_IS_SCRIPTED,
  PART_TYPE_TO_CORE_TYPE,
  PART_TYPE_TO_IELTS_TASK,
  SpeechSuperPartType,
} from "./speechsuper.constants.js";
import { StudentProfileService } from "../student_profiles/student-profile.service.js";

export interface AssessResult {
  attempt: SpeechSuperAttempt;
  scores: {
    overall: number;
    pronunciation: number | null;
    fluency: number | null;
    integrity: number | null;
    rhythm: number | null;
  };
  transcription: string | null;
  rewards: { coins: number; points: number; streak: number } | null;
}

@Injectable()
export class SpeechSuperService {
  private readonly logger = new Logger(SpeechSuperService.name);

  constructor(
    @InjectModel(SpeechSuperTopic)
    private topicModel: typeof SpeechSuperTopic,
    @InjectModel(SpeechSuperQuestion)
    private questionModel: typeof SpeechSuperQuestion,
    @InjectModel(SpeechSuperAttempt)
    private attemptModel: typeof SpeechSuperAttempt,
    private readonly api: SpeechSuperApiService,
    private readonly studentProfileService: StudentProfileService,
  ) {}

  // ---------------------------------------------------------------------------
  // Topics
  // ---------------------------------------------------------------------------

  async createTopic(dto: CreateTopicDto): Promise<SpeechSuperTopic> {
    return this.topicModel.create({ ...dto });
  }

  async findAllTopics(category?: string): Promise<SpeechSuperTopic[]> {
    return this.topicModel.findAll({
      where: { is_active: true, ...(category ? { category } : {}) },
      order: [
        ["sort_order", "ASC"],
        ["createdAt", "DESC"],
      ],
    });
  }

  async findTopic(id: string): Promise<SpeechSuperTopic> {
    const topic = await this.topicModel.findByPk(id);
    if (!topic) throw new NotFoundException(`Topic ${id} not found`);
    return topic;
  }

  async findTopicWithQuestions(id: string): Promise<any> {
    const topic = await this.findTopic(id);
    const questions = await this.questionModel.findAll({
      where: { topic_id: id, is_active: true },
      order: [["sort_order", "ASC"]],
    });
    return { ...topic.toJSON(), questions };
  }

  async updateTopic(id: string, dto: UpdateTopicDto): Promise<SpeechSuperTopic> {
    const topic = await this.findTopic(id);
    await topic.update({ ...dto });
    return topic;
  }

  async removeTopic(id: string): Promise<void> {
    const topic = await this.findTopic(id);
    await topic.destroy();
  }

  // ---------------------------------------------------------------------------
  // Questions
  // ---------------------------------------------------------------------------

  async createQuestion(dto: CreateQuestionDto): Promise<SpeechSuperQuestion> {
    await this.findTopic(dto.topic_id); // validate topic exists
    this.validateQuestionContent(dto.part_type, dto.ref_text, dto.prompt);
    return this.questionModel.create({ ...dto });
  }

  async findQuestionsByTopic(topicId: string): Promise<SpeechSuperQuestion[]> {
    return this.questionModel.findAll({
      where: { topic_id: topicId, is_active: true },
      order: [["sort_order", "ASC"]],
    });
  }

  async findQuestion(id: string): Promise<SpeechSuperQuestion> {
    const question = await this.questionModel.findByPk(id);
    if (!question) throw new NotFoundException(`Question ${id} not found`);
    return question;
  }

  async updateQuestion(
    id: string,
    dto: UpdateQuestionDto,
  ): Promise<SpeechSuperQuestion> {
    const question = await this.findQuestion(id);
    const partType = dto.part_type ?? question.part_type;
    const refText = dto.ref_text ?? question.ref_text;
    const prompt = dto.prompt ?? question.prompt;
    this.validateQuestionContent(partType, refText, prompt);
    await question.update({ ...dto });
    return question;
  }

  async removeQuestion(id: string): Promise<void> {
    const question = await this.findQuestion(id);
    await question.destroy();
  }

  /** Scripted parts need ref_text; unscripted parts need a prompt. */
  private validateQuestionContent(
    partType: SpeechSuperPartType,
    refText?: string,
    prompt?: string,
  ): void {
    const coreType = PART_TYPE_TO_CORE_TYPE[partType];
    if (CORE_TYPE_IS_SCRIPTED[coreType] && !refText) {
      throw new BadRequestException(
        `part_type "${partType}" is scripted and requires ref_text`,
      );
    }
    if (!CORE_TYPE_IS_SCRIPTED[coreType] && !prompt) {
      throw new BadRequestException(
        `part_type "${partType}" is unscripted and requires a prompt`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Assessment
  // ---------------------------------------------------------------------------

  /**
   * Assess a student's audio against a stored question or ad-hoc params,
   * persist the attempt with extracted scores, and award rewards on a pass.
   *
   * @param dto       assessment request
   * @param audioFile optional uploaded audio buffer (multipart). If absent,
   *                  dto.audio_url is downloaded.
   */
  async assess(
    dto: AssessDto,
    audioFile?: Buffer,
  ): Promise<AssessResult> {
    // Resolve part_type / ref_text / prompt — from the stored question if given.
    let question: SpeechSuperQuestion | null = null;
    let partType = dto.part_type;
    let refText = dto.ref_text;
    let prompt = dto.prompt;
    let topicId = dto.topic_id;

    if (dto.question_id) {
      question = await this.findQuestion(dto.question_id);
      partType = partType ?? question.part_type;
      refText = refText ?? question.ref_text;
      prompt = prompt ?? question.prompt;
      topicId = topicId ?? question.topic_id;
    }

    if (!partType) {
      throw new BadRequestException(
        "part_type is required (directly or via question_id)",
      );
    }

    const coreType = PART_TYPE_TO_CORE_TYPE[partType];
    const scripted = CORE_TYPE_IS_SCRIPTED[coreType];

    if (scripted && !refText) {
      throw new BadRequestException(
        `part_type "${partType}" requires ref_text to assess against`,
      );
    }

    // Obtain the audio bytes.
    const audioType = (dto.audio_type ?? "wav").toLowerCase();
    const audio = audioFile ?? (await this.downloadAudio(dto.audio_url));

    // Build SpeechSuper request params.
    const requestParams: SpeechSuperRequestParams = { coreType };
    if (scripted) {
      requestParams.refText = refText;
      if (coreType === PART_TYPE_TO_CORE_TYPE.paragraph) {
        requestParams.paragraph_need_word_score = 1;
      }
    } else if (coreType === PART_TYPE_TO_CORE_TYPE.part1) {
      // IELTS speak.eval.pro
      requestParams.test_type = "ielts";
      requestParams.task_type = PART_TYPE_TO_IELTS_TASK[partType];
      if (prompt) requestParams.question_prompt = prompt;
      if (dto.penalize_offtopic ?? true) requestParams.penalize_offtopic = 1;
    }
    // Non-native transcription model for unscripted types.
    if (!scripted && (dto.non_native ?? true)) {
      requestParams.model = "non_native";
    }

    // Call SpeechSuper.
    const raw = await this.api.evaluate({
      audio,
      audioType,
      userId: dto.student_id,
      requestParams,
    });

    // TEMP: log the raw response so we can confirm the result field names
    // match extractScores(). Remove once the parser is verified.
    this.logger.log(
      `SpeechSuper raw response (${coreType}): ${JSON.stringify(raw)}`,
    );

    const scores = this.extractScores(raw);
    const transcription = this.extractTranscription(raw);
    const apiError = raw?.errId || raw?.error || null;

    // Persist the attempt.
    const attempt = await this.attemptModel.create({
      question_id: dto.question_id ?? null,
      topic_id: topicId ?? null,
      student_id: dto.student_id,
      core_type: coreType,
      part_type: partType,
      ref_text: scripted ? refText : prompt,
      audio_url: dto.audio_url ?? null,
      audio_type: audioType,
      transcription,
      overall_score: scores.overall,
      pronunciation_score: scores.pronunciation,
      fluency_score: scores.fluency,
      integrity_score: scores.integrity,
      rhythm_score: scores.rhythm,
      result: raw,
      error: apiError ? String(apiError) : null,
    });

    // Reward on a passing attempt (>= 80%), scaled 80->100%.
    const rewards = await this.maybeAward(dto.student_id, scores.overall);

    return { attempt, scores, transcription, rewards };
  }

  /** Download audio bytes from a URL. */
  private async downloadAudio(url?: string): Promise<Buffer> {
    if (!url) {
      throw new BadRequestException(
        "Provide either an uploaded audio file or audio_url",
      );
    }
    try {
      const { data } = await axios.get<ArrayBuffer>(url, {
        responseType: "arraybuffer",
        timeout: 30000,
      });
      return Buffer.from(data);
    } catch (err: any) {
      this.logger.error(`Failed to download audio ${url}: ${err?.message}`);
      throw new BadRequestException(`Could not download audio from ${url}`);
    }
  }

  /**
   * Normalize SpeechSuper's per-coreType result shapes into a flat score set.
   * The result block lives under `result` for all coreTypes; scripted types
   * expose `overall`/`pronunciation`/`fluency`/`integrity`/`rhythm`, while
   * IELTS/general expose `overall` plus an `ielts`/proficiency block.
   */
  private extractScores(raw: any): AssessResult["scores"] {
    const r = raw?.result ?? raw ?? {};
    const num = (v: any): number | null => {
      if (v === undefined || v === null) return null;
      const n = typeof v === "string" ? parseFloat(v) : Number(v);
      return Number.isFinite(n) ? n : null;
    };

    // Prefer an explicit overall; otherwise fall back to the IELTS overall band
    // scaled to 0-100, or the pronunciation score.
    const overall =
      num(r.overall) ??
      num(r.pron) ??
      num(r.pronunciation) ??
      (num(r.overallBand) !== null
        ? Math.round((num(r.overallBand) as number) * 11.1) // 9 band -> ~100
        : null) ??
      0;

    return {
      overall: overall ?? 0,
      pronunciation: num(r.pronunciation) ?? num(r.pron),
      fluency: num(r.fluency),
      integrity: num(r.integrity),
      rhythm: num(r.rhythm),
    };
  }

  private extractTranscription(raw: any): string | null {
    const r = raw?.result ?? raw ?? {};
    return r.transcript ?? r.transcription ?? r.text ?? null;
  }

  /**
   * Award rewards for a passing attempt (>= 80%), scaling linearly across the
   * 80%-100% band (5 pts / 1 coin floor -> 10 pts / 3 coins max), mirroring
   * the homework reward model. Best-effort: never fails the assessment.
   */
  private async maybeAward(
    studentId: string,
    overall: number,
  ): Promise<AssessResult["rewards"]> {
    if (!studentId || overall < 80) return null;
    const t = Math.max(0, Math.min(overall, 100) - 80) / 20;
    const points = Math.round(5 + t * 5);
    const coins = Math.round(1 + t * 2);

    try {
      await this.studentProfileService.addPoints(studentId, points);
      await this.studentProfileService.addCoins(studentId, coins);
      const { streakGranted } =
        await this.studentProfileService.incrementStreakIfNewDay(studentId);
      return { points, coins, streak: streakGranted ? 1 : 0 };
    } catch (err: any) {
      this.logger.warn(
        `Failed to award SpeechSuper rewards to ${studentId}: ${err?.message}`,
      );
      return null;
    }
  }

  // ---------------------------------------------------------------------------
  // Attempts / history
  // ---------------------------------------------------------------------------

  async findAttempt(id: string): Promise<SpeechSuperAttempt> {
    const attempt = await this.attemptModel.findByPk(id);
    if (!attempt) throw new NotFoundException(`Attempt ${id} not found`);
    return attempt;
  }

  async findAttemptsByStudent(
    studentId: string,
  ): Promise<SpeechSuperAttempt[]> {
    return this.attemptModel.findAll({
      where: { student_id: studentId },
      order: [["createdAt", "DESC"]],
    });
  }

  async findAttemptsByQuestion(
    questionId: string,
    studentId?: string,
  ): Promise<SpeechSuperAttempt[]> {
    return this.attemptModel.findAll({
      where: { question_id: questionId, ...(studentId ? { student_id: studentId } : {}) },
      order: [["createdAt", "DESC"]],
    });
  }
}
