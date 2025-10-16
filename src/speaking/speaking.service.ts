import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Speaking } from './entities/speaking.entity.js';
import { CreateSpeakingDto } from './dto/create-speaking.dto.js';
import { UpdateSpeakingDto } from './dto/update-speaking.dto.js';
import { PronunciationExercise } from '../pronunciation-exercise/entities/pronunciation-exercise.entity.js';
import { Ieltspart1Question } from '../ieltspart1-question/entities/ieltspart1-question.entity.js';
import { Ieltspart2Question } from '../ieltspart2-question/entities/ieltspart2-question.entity.js';
import { Ieltspart3Question } from '../ieltspart3-question/entities/ieltspart3-question.entity.js';

@Injectable()
export class SpeakingService {
  constructor(
    @InjectModel(Speaking)
    private speakingModel: typeof Speaking,
    @InjectModel(PronunciationExercise)
    private pronunciationModel: typeof PronunciationExercise,
    @InjectModel(Ieltspart1Question)
    private ieltspart1Model: typeof Ieltspart1Question,
    @InjectModel(Ieltspart2Question)
    private ieltspart2Model: typeof Ieltspart2Question,
    @InjectModel(Ieltspart3Question)
    private ieltspart3Model: typeof Ieltspart3Question
  ) {}

  async create(createSpeakingDto: CreateSpeakingDto): Promise<Speaking> {
    const speaking = await this.speakingModel.create({
      lessonId: createSpeakingDto.lessonId,
      title: createSpeakingDto.title,
      type: createSpeakingDto.type
    });

    return speaking;
  }

  async findAll(): Promise<Speaking[]> {
    return this.speakingModel.findAll();
  }

  async findOne(id: string): Promise<any> {
    // Get the speaking exercise with eager loading of related entities
    const speaking = await this.speakingModel.findByPk(id, {
      include: [
        {
          model: this.pronunciationModel,
          as: 'pronunciationExercises',
          required: false
        },
        {
          model: this.ieltspart1Model,
          as: 'part1Questions',
          required: false
        },
        {
          model: this.ieltspart2Model,
          as: 'part2Questions',
          required: false
        },
        {
          model: this.ieltspart3Model,
          as: 'part3Questions',
          required: false
        }
      ]
    });
    
    if (!speaking) {
      throw new NotFoundException(`Speaking exercise with ID ${id} not found`);
    }

    return speaking;
  }

  async findByLesson(lessonId: string): Promise<any[]> {
    // Get all speaking exercises for the lesson with eager loading of related entities
    const speakingExercises = await this.speakingModel.findAll({
      where: { lessonId },
      include: [
        {
          model: this.pronunciationModel,
          as: 'pronunciationExercises',
          required: false
        },
        {
          model: this.ieltspart1Model,
          as: 'part1_questions',
          required: false
        },
        {
          model: this.ieltspart2Model,
          as: 'part2_questions',
          required: false
        },
        {
          model: this.ieltspart3Model,
          as: 'part3_questions',
          required: false
        }
      ]
    });

    return speakingExercises;
  }

  async getByType(type: 'speaking' | 'pronunciation'): Promise<any[]> {
    // Get all speaking exercises by type with eager loading of related entities
    const speakingExercises = await this.speakingModel.findAll({
      where: { type },
      include: [
        {
          model: this.pronunciationModel,
          as: 'pronunciationExercises',
          required: false
        },
        {
          model: this.ieltspart1Model,
          as: 'part1_questions',
          required: false
        },
        {
          model: this.ieltspart2Model,
          as: 'part2_questions',
          required: false
        },
        {
          model: this.ieltspart3Model,
          as: 'part3_questions',
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return speakingExercises;
  }

  async update(id: string, updateSpeakingDto: UpdateSpeakingDto): Promise<Speaking> {
    const speaking = await this.speakingModel.findByPk(id);
    
    if (!speaking) {
      throw new NotFoundException(`Speaking exercise with ID ${id} not found`);
    }
    
    await speaking.update(updateSpeakingDto);
    return speaking;
  }

  async countRelatedEntities(id: string): Promise<any> {
    const pronunciationCount = await this.pronunciationModel.count({
      where: { speaking_id: id }
    });
    
    const part1Count = await this.ieltspart1Model.count({
      where: { speaking_id: id }
    });
    
    const part2Count = await this.ieltspart2Model.count({
      where: { speaking_id: id }
    });
    
    const part3Count = await this.ieltspart3Model.count({
      where: { speaking_id: id }
    });
    
    return {
      pronunciationExercises: pronunciationCount,
      part1Questions: part1Count,
      part2Questions: part2Count,
      part3Questions: part3Count,
      total: pronunciationCount + part1Count + part2Count + part3Count
    };
  }
  
  async deleteRelatedEntities(id: string): Promise<any> {
    // First count what will be deleted
    const countBefore = await this.countRelatedEntities(id);
    
    // Use Sequelize transaction to ensure data consistency
    const t = await this.speakingModel.sequelize.transaction();
    
    try {
      // Delete all pronunciation exercises associated with this speaking exercise
      await this.pronunciationModel.destroy({
        where: { speaking_id: id },
        transaction: t
      });
      
      // Delete all IELTS part 1 questions associated with this speaking exercise
      await this.ieltspart1Model.destroy({
        where: { speaking_id: id },
        transaction: t
      });
      
      // Delete all IELTS part 2 questions associated with this speaking exercise
      await this.ieltspart2Model.destroy({
        where: { speaking_id: id },
        transaction: t
      });
      
      // Delete all IELTS part 3 questions associated with this speaking exercise
      await this.ieltspart3Model.destroy({
        where: { speaking_id: id },
        transaction: t
      });
      
      // Commit the transaction if all operations succeed
      await t.commit();
      
      // Return summary of what was deleted
      return {
        message: 'Successfully deleted all related entities',
        deleted: countBefore
      };
    } catch (error) {
      // Rollback the transaction if any operation fails
      await t.rollback();
      throw error;
    }
  }

  async remove(id: string): Promise<any> {
    // First check if speaking exercise exists
    const speaking = await this.speakingModel.findByPk(id);
    
    if (!speaking) {
      throw new NotFoundException(`Speaking exercise with ID ${id} not found`);
    }
    
    // Count what will be deleted
    const countBefore = await this.countRelatedEntities(id);
    const speakingDetails = speaking.toJSON();
    
    // Use a transaction for complete delete operation
    const t = await this.speakingModel.sequelize.transaction();
    
    try {
      // Delete all pronunciation exercises associated with this speaking exercise
      await this.pronunciationModel.destroy({
        where: { speaking_id: id },
        transaction: t
      });
      
      // Delete all IELTS part 1 questions associated with this speaking exercise
      await this.ieltspart1Model.destroy({
        where: { speaking_id: id },
        transaction: t
      });
      
      // Delete all IELTS part 2 questions associated with this speaking exercise
      await this.ieltspart2Model.destroy({
        where: { speaking_id: id },
        transaction: t
      });
      
      // Delete all IELTS part 3 questions associated with this speaking exercise
      await this.ieltspart3Model.destroy({
        where: { speaking_id: id },
        transaction: t
      });
      
      // Finally delete the speaking exercise itself
      await speaking.destroy({ transaction: t });
      
      // Commit the transaction if all operations succeed
      await t.commit();
      
      // Return summary of what was deleted
      return {
        message: 'Successfully deleted speaking exercise and all related entities',
        speaking: speakingDetails,
        relatedEntities: countBefore
      };
    } catch (error) {
      // Rollback the transaction if any operation fails
      await t.rollback();
      throw error;
    }
  }
}
