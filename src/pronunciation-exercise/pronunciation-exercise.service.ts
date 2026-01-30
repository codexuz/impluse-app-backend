import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { PronunciationExercise } from "./entities/pronunciation-exercise.entity.js";
import { CreatePronunciationExerciseDto } from "./dto/create-pronunciation-exercise.dto.js";
import { UpdatePronunciationExerciseDto } from "./dto/update-pronunciation-exercise.dto.js";
import { AwsStorageService } from "../aws-storage/aws-storage.service.js";
import { VoiceChatBotService } from "../services/voice-chat-bot/voice-chat-bot.service.js";

@Injectable()
export class PronunciationExerciseService {

  constructor(
    @InjectModel(PronunciationExercise)
    private pronunciationExerciseModel: typeof PronunciationExercise,
    private readonly awsStorageService: AwsStorageService,
    private readonly voiceChatBotService: VoiceChatBotService,
  ) {}

  async create(
    createPronunciationExerciseDto: CreatePronunciationExerciseDto,
  ): Promise<PronunciationExercise> {
    // Generate audio from word_to_pronunce text
    const audioResult = await this.voiceChatBotService.textToVoiceAndSave(
      createPronunciationExerciseDto.word_to_pronunce,
    );

    return await this.pronunciationExerciseModel.create({
      ...createPronunciationExerciseDto,
      audio_url: audioResult.url,
      audio_key: audioResult.key,
    });
  }

  async findAll(): Promise<PronunciationExercise[]> {
    return await this.pronunciationExerciseModel.findAll();
  }

  async findOne(id: string): Promise<PronunciationExercise> {
    const exercise = await this.pronunciationExerciseModel.findByPk(id);

    if (!exercise) {
      throw new NotFoundException(
        `Pronunciation exercise with ID ${id} not found`,
      );
    }

    return exercise;
  }

  async findBySpeakingId(
    speaking_id: string,
  ): Promise<PronunciationExercise[]> {
    return await this.pronunciationExerciseModel.findAll({
      where: { speaking_id },
    });
  }

  async update(
    id: string,
    updatePronunciationExerciseDto: UpdatePronunciationExerciseDto,
  ): Promise<PronunciationExercise> {
    const [affectedCount, [updatedExercise]] =
      await this.pronunciationExerciseModel.update(
        updatePronunciationExerciseDto,
        {
          where: { id },
          returning: true,
        },
      );

    if (affectedCount === 0) {
      throw new NotFoundException(
        `Pronunciation exercise with ID ${id} not found`,
      );
    }

    return updatedExercise;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.pronunciationExerciseModel.destroy({
      where: { id },
    });

    if (deleted === 0) {
      throw new NotFoundException(
        `Pronunciation exercise with ID ${id} not found`,
      );
    }
  }
}
