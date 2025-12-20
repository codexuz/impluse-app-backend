import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { VocabularySet } from "./entities/vocabulary_set.entity.js";
import { CreateVocabularySetDto } from "./dto/create-vocabulary_set.dto.js";
import { UpdateVocabularySetDto } from "./dto/update-vocabulary_set.dto.js";
import { VocabularyItem } from "../vocabulary_items/entities/vocabulary_item.entity.js";
import { StudentVocabularyProgress } from "../student_vocabulary_progress/entities/student_vocabulary_progress.entity.js";
import { VocabularyProgressStatus } from "../student_vocabulary_progress/enums/vocabulary-progress-status.enum.js";

@Injectable()
export class VocabularySetsService {
  constructor(
    @InjectModel(VocabularySet)
    private vocabularySetModel: typeof VocabularySet,
    @InjectModel(VocabularyItem)
    private vocabularyItemModel: typeof VocabularyItem,
    @InjectModel(StudentVocabularyProgress)
    private studentVocabularyProgressModel: typeof StudentVocabularyProgress
  ) {}

  async create(
    createVocabularySetDto: CreateVocabularySetDto
  ): Promise<VocabularySet> {
    return this.vocabularySetModel.create({ ...createVocabularySetDto });
  }

  async findAll(): Promise<VocabularySet[]> {
    return this.vocabularySetModel.findAll();
  }

  async findOne(id: string): Promise<VocabularySet> {
    const vocabularySet = await this.vocabularySetModel.findByPk(id);
    if (!vocabularySet) {
      throw new NotFoundException(`Vocabulary set with ID "${id}" not found`);
    }
    return vocabularySet;
  }

  async findByCourse(courseId: string): Promise<VocabularySet[]> {
    return this.vocabularySetModel.findAll({
      where: { course_id: courseId },
    });
  }

  async findByLevel(level: string): Promise<VocabularySet[]> {
    return this.vocabularySetModel.findAll({
      where: { level },
    });
  }

  async findByTopic(topic: string): Promise<VocabularySet[]> {
    return this.vocabularySetModel.findAll({
      where: { topic },
    });
  }

  async update(
    id: string,
    updateVocabularySetDto: UpdateVocabularySetDto
  ): Promise<VocabularySet> {
    const vocabularySet = await this.findOne(id);
    await vocabularySet.update(updateVocabularySetDto);
    return vocabularySet;
  }

  async remove(id: string): Promise<void> {
    const vocabularySet = await this.findOne(id);
    await vocabularySet.destroy();
  }

  /**
   * Get student's progress across all vocabulary sets
   * Returns per-set: allWords, masteredWords, percentage and items with status
   */
  async getStudentProgressForAllSets(studentId: string): Promise<any[]> {
    const sets = await this.vocabularySetModel.findAll();

    // Fetch all vocabulary items for all sets to minimize queries
    const allItems = await this.vocabularyItemModel.findAll();

    // Map setId -> items
    const itemsBySet = new Map<string, any[]>();
    allItems.forEach((it) => {
      const arr = itemsBySet.get(it.set_id) || [];
      arr.push(it);
      itemsBySet.set(it.set_id, arr);
    });

    const results = [];

    for (const set of sets) {
      const items = itemsBySet.get(set.id) || [];
      const itemIds = items.map((i) => i.id);

      const progresses = itemIds.length
        ? await this.studentVocabularyProgressModel.findAll({
            where: { student_id: studentId, vocabulary_item_id: itemIds },
          })
        : [];

      const masteredCount = progresses.filter(
        (p) => p.status === VocabularyProgressStatus.MASTERED
      ).length;

      const percentage =
        items.length === 0
          ? 0
          : Math.round((masteredCount / items.length) * 100);

  

      results.push({
        setId: set.id,
        title: set.title,
        allWords: items.length,
        masteredWords: masteredCount,
        percentage,
      });
    }

    return results;
  }
}
