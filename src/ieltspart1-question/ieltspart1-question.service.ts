import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Ieltspart1Question } from "./entities/ieltspart1-question.entity.js";
import { CreateIeltspart1QuestionDto } from "./dto/create-ieltspart1-question.dto.js";
import { UpdateIeltspart1QuestionDto } from "./dto/update-ieltspart1-question.dto.js";
import { AwsStorageService } from "../aws-storage/aws-storage.service.js";
import { VoiceChatBotService } from "../services/voice-chat-bot/voice-chat-bot.service.js";

@Injectable()
export class Ieltspart1QuestionService {
  private readonly bucketName = "impulse-voice-audio";

  constructor(
    @InjectModel(Ieltspart1Question)
    private ieltspart1QuestionModel: typeof Ieltspart1Question,
    private readonly awsStorageService: AwsStorageService,
    private readonly voiceChatBotService: VoiceChatBotService,
  ) {}

  async create(
    createIeltspart1QuestionDto: CreateIeltspart1QuestionDto,
  ): Promise<Ieltspart1Question> {
    // Generate audio from question text
    const audioResult = await this.voiceChatBotService.textToVoiceAndSave(
      createIeltspart1QuestionDto.question,
    );

    return await this.ieltspart1QuestionModel.create({
      ...createIeltspart1QuestionDto,
      audio_url: audioResult.url,
      audio_key: audioResult.key,
    });
  }

  async findAll(): Promise<Ieltspart1Question[]> {
    const questions = await this.ieltspart1QuestionModel.findAll();
    return await this.refreshAudioUrls(questions);
  }

  async findOne(id: string): Promise<Ieltspart1Question> {
    const question = await this.ieltspart1QuestionModel.findOne({
      where: { id },
    });
    if (!question) {
      throw new NotFoundException(
        `IELTS Part 1 question with ID ${id} not found`,
      );
    }
    return await this.refreshAudioUrl(question);
  }

  async findBySpeakingId(speakingId: string): Promise<Ieltspart1Question[]> {
    const questions = await this.ieltspart1QuestionModel.findAll({
      where: { speaking_id: speakingId },
    });
    return await this.refreshAudioUrls(questions);
  }

  async update(
    id: string,
    updateIeltspart1QuestionDto: UpdateIeltspart1QuestionDto,
  ): Promise<Ieltspart1Question> {
    const question = await this.findOne(id);
    await question.update(updateIeltspart1QuestionDto);
    return question;
  }

  async remove(id: string): Promise<void> {
    const question = await this.findOne(id);
    await question.destroy();
  }

  /**
   * Refresh presigned URL for a single question
   */
  private async refreshAudioUrl(
    question: Ieltspart1Question,
  ): Promise<Ieltspart1Question> {
    if (question.audio_key) {
      question.audio_url = await this.awsStorageService.getPresignedUrl(
        this.bucketName,
        question.audio_key,
        604800, // 7 days
      );
    }
    return question;
  }

  /**
   * Refresh presigned URLs for multiple questions
   */
  private async refreshAudioUrls(
    questions: Ieltspart1Question[],
  ): Promise<Ieltspart1Question[]> {
    return await Promise.all(
      questions.map(async (question) => this.refreshAudioUrl(question)),
    );
  }
}
