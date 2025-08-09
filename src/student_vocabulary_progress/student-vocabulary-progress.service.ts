import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudentVocabularyProgress } from './entities/student_vocabulary_progress.entity.js';
import { CreateStudentVocabularyProgressDto } from './dto/create-student-vocabulary-progress.dto.js';
import { UpdateStudentVocabularyProgressDto } from './dto/update-student-vocabulary-progress.dto.js';
import { VocabularyProgressStatus } from './enums/vocabulary-progress-status.enum.js';

@Injectable()
export class StudentVocabularyProgressService {
  constructor(
    @InjectModel(StudentVocabularyProgress)
    private studentVocabularyProgressModel: typeof StudentVocabularyProgress,
  ) {}

  async create(createDto: CreateStudentVocabularyProgressDto): Promise<StudentVocabularyProgress> {
    return this.studentVocabularyProgressModel.create({ ...createDto });
  }

  async findAll(): Promise<StudentVocabularyProgress[]> {
    return this.studentVocabularyProgressModel.findAll();
  }

  async findOne(id: string): Promise<StudentVocabularyProgress> {
    const progress = await this.studentVocabularyProgressModel.findByPk(id);
    if (!progress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }
    return progress;
  }

  async findByStudent(studentId: string): Promise<StudentVocabularyProgress[]> {
    return this.studentVocabularyProgressModel.findAll({
      where: { student_id: studentId }
    });
  }

  async findByVocabularyItem(vocabularyItemId: string): Promise<StudentVocabularyProgress[]> {
    return this.studentVocabularyProgressModel.findAll({
      where: { vocabulary_item_id: vocabularyItemId }
    });
  }

  async findByStudentAndVocabularyItem(studentId: string, vocabularyItemId: string): Promise<StudentVocabularyProgress> {
    const progress = await this.studentVocabularyProgressModel.findOne({
      where: {
        student_id: studentId,
        vocabulary_item_id: vocabularyItemId
      }
    });
    if (!progress) {
      throw new NotFoundException(`Progress not found for student ${studentId} and vocabulary item ${vocabularyItemId}`);
    }
    return progress;
  }

  async update(id: string, updateDto: UpdateStudentVocabularyProgressDto): Promise<StudentVocabularyProgress> {
    const progress = await this.findOne(id);
    await progress.update(updateDto);
    return progress;
  }

  async remove(id: string): Promise<void> {
    const progress = await this.findOne(id);
    await progress.destroy();
  }

  async updateStatus(id: string, status: VocabularyProgressStatus): Promise<StudentVocabularyProgress> {
    const progress = await this.findOne(id);
    await progress.update({ status });
    return progress;
  }

  async getStudentProgressStats(studentId: string): Promise<{ [key in VocabularyProgressStatus]: number }> {
    const progress = await this.studentVocabularyProgressModel.findAll({
      where: { student_id: studentId }
    });

    return {
      [VocabularyProgressStatus.LEARNING]: progress.filter(p => p.status === VocabularyProgressStatus.LEARNING).length,
      [VocabularyProgressStatus.REVIEWING]: progress.filter(p => p.status === VocabularyProgressStatus.REVIEWING).length,
      [VocabularyProgressStatus.MASTERED]: progress.filter(p => p.status === VocabularyProgressStatus.MASTERED).length,
    };
  }
}
