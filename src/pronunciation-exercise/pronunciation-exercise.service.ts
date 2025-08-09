import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PronunciationExercise } from './entities/pronunciation-exercise.entity.js';
import { CreatePronunciationExerciseDto } from './dto/create-pronunciation-exercise.dto.js';
import { UpdatePronunciationExerciseDto } from './dto/update-pronunciation-exercise.dto.js';

@Injectable()
export class PronunciationExerciseService {
  constructor(
    @InjectModel(PronunciationExercise)
    private pronunciationExerciseModel: typeof PronunciationExercise,
  ) {}

  async create(createPronunciationExerciseDto: CreatePronunciationExerciseDto): Promise<PronunciationExercise> {
    return await this.pronunciationExerciseModel.create({
      ...createPronunciationExerciseDto
    });
  }

  async findAll(): Promise<PronunciationExercise[]> {
    return await this.pronunciationExerciseModel.findAll();
  }

  async findOne(id: string): Promise<PronunciationExercise> {
    const exercise = await this.pronunciationExerciseModel.findByPk(id);
    
    if (!exercise) {
      throw new NotFoundException(`Pronunciation exercise with ID ${id} not found`);
    }

    return exercise;
  }

  async findBySpeakingId(speaking_id: string): Promise<PronunciationExercise[]> {
    return await this.pronunciationExerciseModel.findAll({
      where: { speaking_id }
    });
  }

  async update(id: string, updatePronunciationExerciseDto: UpdatePronunciationExerciseDto): Promise<PronunciationExercise> {
    const [affectedCount, [updatedExercise]] = await this.pronunciationExerciseModel.update(
      updatePronunciationExerciseDto,
      {
        where: { id },
        returning: true
      }
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Pronunciation exercise with ID ${id} not found`);
    }

    return updatedExercise;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.pronunciationExerciseModel.destroy({
      where: { id }
    });

    if (deleted === 0) {
      throw new NotFoundException(`Pronunciation exercise with ID ${id} not found`);
    }
  }
}
