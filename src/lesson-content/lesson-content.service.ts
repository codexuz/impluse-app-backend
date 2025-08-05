import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LessonContent } from './entities/lesson-content.entity.js';
import { CreateLessonContentDto } from './dto/create-lesson-content.dto.js';
import { UpdateLessonContentDto } from './dto/update-lesson-content.dto.js';

@Injectable()
export class LessonContentService {
  constructor(
    @InjectModel(LessonContent)
    private lessonContentModel: typeof LessonContent,
  ) {}

  async create(createLessonContentDto: CreateLessonContentDto): Promise<LessonContent> {
    return await this.lessonContentModel.create({ ...createLessonContentDto });
  }

  async findAll(): Promise<LessonContent[]> {
    return await this.lessonContentModel.findAll({
      where: { isActive: true },
      order: [['order_number', 'ASC']]
    });
  }

  async findOne(id: string): Promise<LessonContent> {
    const content = await this.lessonContentModel.findByPk(id);
    if (!content) {
      throw new NotFoundException(`Lesson content with ID ${id} not found`);
    }
    return content;
  }

    async findByLessonId(lessonId: string): Promise<LessonContent[]> {
    const contents = await this.lessonContentModel.findAll({
      where: { 
        lessonId,
        isActive: true 
      },
      order: [['order_number', 'ASC']]
    });

    if (!contents.length) {
      throw new NotFoundException(`No content found for lesson ID ${lessonId}`);
    }

    return contents;
  }

  async update(id: string, updateLessonContentDto: UpdateLessonContentDto): Promise<LessonContent> {
    const content = await this.findOne(id);
    return await content.update(updateLessonContentDto);
  }

  async remove(id: string): Promise<{ id: string }> {
    const content = await this.findOne(id);
    await content.update({ isActive: false });
    return { id };
  }
}