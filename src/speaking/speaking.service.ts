import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Speaking } from './entities/speaking.entity.js';
import { CreateSpeakingDto } from './dto/create-speaking.dto.js';
import { UpdateSpeakingDto } from './dto/update-speaking.dto.js';
import { RoleScenario } from '../role-scenarios/entities/role-scenario.entity.js';
import { PronunciationExercise } from '../pronunciation-exercise/entities/pronunciation-exercise.entity.js';
import { Ieltspart1Question } from '../ieltspart1-question/entities/ieltspart1-question.entity.js';
import { Ieltspart2Question } from '../ieltspart2-question/entities/ieltspart2-question.entity.js';
import { Ieltspart3Question } from '../ieltspart3-question/entities/ieltspart3-question.entity.js';

@Injectable()
export class SpeakingService {
  constructor(
    @InjectModel(Speaking)
    private speakingModel: typeof Speaking,
    @InjectModel(RoleScenario)
    private roleScenarioModel: typeof RoleScenario,
    @InjectModel(PronunciationExercise)
    private pronunciationModel: typeof PronunciationExercise,
    @InjectModel(Ieltspart1Question)
    private ieltspart1Model: typeof Ieltspart1Question,
    @InjectModel(Ieltspart2Question)
    private ieltspart2Model: typeof Ieltspart2Question,
    @InjectModel(Ieltspart3Question)
    private ieltspart3Model: typeof Ieltspart3Question,
  ) {}

  async create(createSpeakingDto: CreateSpeakingDto): Promise<Speaking> {
    const speaking = await this.speakingModel.create({ ...createSpeakingDto });

    // Create associated exercises if provided in the DTO
    if (createSpeakingDto.roleScenarios) {
      await this.roleScenarioModel.bulkCreate(
        createSpeakingDto.roleScenarios.map(scenario => ({
          ...scenario,
          speaking_id: speaking.id
        }))
      );
    }

    if (createSpeakingDto.pronunciationExercises) {
      await this.pronunciationModel.bulkCreate(
        createSpeakingDto.pronunciationExercises.map(exercise => ({
          ...exercise,
          speaking_id: speaking.id
        }))
      );
    }

    if (createSpeakingDto.ieltspart1Questions) {
      await this.ieltspart1Model.bulkCreate(
        createSpeakingDto.ieltspart1Questions.map(question => ({
          ...question,
          speaking_id: speaking.id
        }))
      );
    }

    if (createSpeakingDto.ieltspart2Questions) {
      await this.ieltspart2Model.bulkCreate(
        createSpeakingDto.ieltspart2Questions.map(question => ({
          ...question,
          speaking_id: speaking.id
        }))
      );
    }

    if (createSpeakingDto.ieltspart3Questions) {
      await this.ieltspart3Model.bulkCreate(
        createSpeakingDto.ieltspart3Questions.map(question => ({
          ...question,
          speaking_id: speaking.id
        }))
      );
    }

    return this.findOne(speaking.id);
  }

  async findAll(): Promise<Speaking[]> {
    return this.speakingModel.findAll({
      include: [
        { model: RoleScenario, as: 'role_scenario' },
        { model: PronunciationExercise, as: 'pronunciationExercise' },
        { model: Ieltspart1Question, as: 'part1_questions' },
        { model: Ieltspart2Question, as: 'part2_questions' },
        { model: Ieltspart3Question, as: 'part3_questions' },
      ]
    });
  }

  async findOne(id: string): Promise<Speaking> {
    const speaking = await this.speakingModel.findByPk(id, {
      include: [
        { model: RoleScenario, as: 'role_scenario' },
        { model: PronunciationExercise, as: 'pronunciationExercise' },
        { model: Ieltspart1Question, as: 'part1_questions' },
        { model: Ieltspart2Question, as: 'part2_questions' },
        { model: Ieltspart3Question, as: 'part3_questions' },
      ]
    });
    
    if (!speaking) {
      throw new NotFoundException('Speaking not found');
    }
    return speaking;
  }

  async update(id: string, updateSpeakingDto: UpdateSpeakingDto): Promise<Speaking> {
    const speaking = await this.findOne(id);
    await speaking.update(updateSpeakingDto);

    // Handle updates to related models if provided
    if (updateSpeakingDto.roleScenarios) {
      await this.roleScenarioModel.destroy({ where: { speaking_id: id } });
      await this.roleScenarioModel.bulkCreate(
        updateSpeakingDto.roleScenarios.map(scenario => ({
          ...scenario,
          speaking_id: id
        }))
      );
    }

    if (updateSpeakingDto.pronunciationExercises) {
      await this.pronunciationModel.destroy({ where: { speaking_id: id } });
      await this.pronunciationModel.bulkCreate(
        updateSpeakingDto.pronunciationExercises.map(exercise => ({
          ...exercise,
          speaking_id: id
        }))
      );
    }

    if (updateSpeakingDto.ieltspart1Questions) {
      await this.ieltspart1Model.destroy({ where: { speaking_id: id } });
      await this.ieltspart1Model.bulkCreate(
        updateSpeakingDto.ieltspart1Questions.map(question => ({
          ...question,
          speaking_id: id
        }))
      );
    }

    if (updateSpeakingDto.ieltspart2Questions) {
      await this.ieltspart2Model.destroy({ where: { speaking_id: id } });
      await this.ieltspart2Model.bulkCreate(
        updateSpeakingDto.ieltspart2Questions.map(question => ({
          ...question,
          speaking_id: id
        }))
      );
    }

    if (updateSpeakingDto.ieltspart3Questions) {
      await this.ieltspart3Model.destroy({ where: { speaking_id: id } });
      await this.ieltspart3Model.bulkCreate(
        updateSpeakingDto.ieltspart3Questions.map(question => ({
          ...question,
          speaking_id: id
        }))
      );
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const speaking = await this.findOne(id);
    // Related records will be deleted automatically if cascade is set up in the models
    await speaking.destroy();
  }
}