import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LessonVocabularySet } from './entities/lesson_vocabulary_set.entity.js';
import { CreateLessonVocabularySetDto } from './dto/create-lesson-vocabulary-set.dto.js';
import { UpdateLessonVocabularySetDto } from './dto/update-lesson-vocabulary-set.dto.js';
import { UnitVocabularySet } from '../unit_vocabulary_sets/entities/unit_vocabulary_set.entity.js';
import { VocabularyItem } from '../vocabulary_items/entities/vocabulary_item.entity.js';
import { StudentVocabularyProgressService } from '../student_vocabulary_progress/student-vocabulary-progress.service.js';

@Injectable()
export class LessonVocabularySetService {
  constructor(
    @InjectModel(LessonVocabularySet)
    private lessonVocabularySetModel: typeof LessonVocabularySet,
    private studentVocabularyProgressService: StudentVocabularyProgressService,
  ) { }

  async create(createLessonVocabularySetDto: CreateLessonVocabularySetDto): Promise<LessonVocabularySet> {
    return await this.lessonVocabularySetModel.create({
      ...createLessonVocabularySetDto
    });
  }

  async createMany(createDtos: CreateLessonVocabularySetDto[]): Promise<LessonVocabularySet[]> {
    return await this.lessonVocabularySetModel.bulkCreate(createDtos as any[]);
  }

  async findAll(): Promise<LessonVocabularySet[]> {
    return await this.lessonVocabularySetModel.findAll();
  }

  async findOne(id: string): Promise<LessonVocabularySet> {
    const vocabularySet = await this.lessonVocabularySetModel.findByPk(id);

    if (!vocabularySet) {
      throw new NotFoundException(`Lesson vocabulary set with ID ${id} not found`);
    }

    return vocabularySet;
  }

  async findByLessonId(lesson_id: string, student_id?: string): Promise<any[]> {
    const lessonVocabs = await this.lessonVocabularySetModel.findAll({
      where: { lesson_id },
      include: [
        {
          model: UnitVocabularySet,
          as: 'unit_vocabulary_set',
          include: [
            {
              model: VocabularyItem,
              as: 'vocabulary_items',
            },
          ],
        }
      ]
    });

    const results = [];
    for (const item of lessonVocabs) {
      const vocabData = item.toJSON();

      if (vocabData.unit_vocabulary_set) {
        const vocabItems = vocabData.unit_vocabulary_set.vocabulary_items || [];
        vocabData.unit_vocabulary_set.vocabulary_items_count = vocabItems.length;

        if (student_id && vocabItems.length > 0) {
          // Get student progress for each vocabulary item
          const itemsWithProgress = [];
          for (const vocabItem of vocabItems) {
            const progress = await this.studentVocabularyProgressService.findWordStatus(
              student_id,
              vocabItem.id
            );
            itemsWithProgress.push({
              id: vocabItem.id,
              progress_status: progress?.status || null,
            });
          }
          vocabData.unit_vocabulary_set.vocabulary_items = itemsWithProgress;
        } else {
          // Remove raw items, only keep count
          delete vocabData.unit_vocabulary_set.vocabulary_items;
        }
      }

      results.push(vocabData);
    }

    return results;
  }

  async findByUnitVocabularySetId(unit_vocabulary_set_id: string): Promise<LessonVocabularySet[]> {
    return await this.lessonVocabularySetModel.findAll({
      where: { unit_vocabulary_set_id }
    });
  }

  async update(id: string, updateLessonVocabularySetDto: UpdateLessonVocabularySetDto): Promise<LessonVocabularySet> {
    const [affectedCount, [updatedSet]] = await this.lessonVocabularySetModel.update(
      updateLessonVocabularySetDto,
      {
        where: { id },
        returning: true
      }
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Lesson vocabulary set with ID ${id} not found`);
    }

    return updatedSet;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.lessonVocabularySetModel.destroy({
      where: { id }
    });

    if (deleted === 0) {
      throw new NotFoundException(`Lesson vocabulary set with ID ${id} not found`);
    }
  }

  async removeByLessonId(lesson_id: string): Promise<number> {
    return await this.lessonVocabularySetModel.destroy({
      where: { lesson_id }
    });
  }
}
