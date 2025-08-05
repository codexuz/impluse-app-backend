import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateLessonProgressDto } from './dto/create-lesson-progress.dto.js';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto.js';
import { LessonProgress } from './entities/lesson_progress.entity.js';

@Injectable()
export class LessonProgressService {
  constructor(
    @InjectModel(LessonProgress)
    private lessonProgressModel: typeof LessonProgress,
  ) {}

  async create(createLessonProgressDto: CreateLessonProgressDto): Promise<LessonProgress> {
    return this.lessonProgressModel.create({ ...createLessonProgressDto });
  }

  async findAll(): Promise<LessonProgress[]> {
    return this.lessonProgressModel.findAll();
  }

  async findOne(id: string): Promise<LessonProgress> {
    const lessonProgress = await this.lessonProgressModel.findByPk(id);
    if (!lessonProgress) {
      throw new NotFoundException('Lesson progress not found');
    }
    return lessonProgress;
  }

  async findByStudentId(studentId: string): Promise<LessonProgress[]> {
    return this.lessonProgressModel.findAll({
      where: { student_id: studentId }
    });
  }

  async findByLessonId(lessonId: string): Promise<LessonProgress[]> {
    return this.lessonProgressModel.findAll({
      where: { lesson_id: lessonId }
    });
  }

  async findByStudentAndLesson(studentId: string, lessonId: string): Promise<LessonProgress> {
    const progress = await this.lessonProgressModel.findOne({
      where: { student_id: studentId, lesson_id: lessonId }
    });
    if (!progress) {
      throw new NotFoundException('Lesson progress not found for this student and lesson');
    }
    return progress;
  }

  async update(id: string, updateLessonProgressDto: UpdateLessonProgressDto): Promise<LessonProgress> {
    const lessonProgress = await this.findOne(id);
    await lessonProgress.update(updateLessonProgressDto);
    return lessonProgress;
  }

  async remove(id: string): Promise<void> {
    const lessonProgress = await this.findOne(id);
    await lessonProgress.destroy();
  }
}
  
