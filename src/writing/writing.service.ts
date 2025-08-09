import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateWritingDto } from './dto/create-writing.dto.js';
import { UpdateWritingDto } from './dto/update-writing.dto.js';
import { Writing } from './entities/writing.entity.js';

@Injectable()
export class WritingService {
  constructor(
    @InjectModel(Writing)
    private writingModel: typeof Writing,
  ) {}

  async create(createWritingDto: CreateWritingDto): Promise<Writing> {
    return await this.writingModel.create({
      ...createWritingDto
    });
  }

  async findAll(): Promise<Writing[]> {
    return await this.writingModel.findAll();
  }

  async findOne(id: string): Promise<Writing> {
    const writing = await this.writingModel.findByPk(id);
    if (!writing) {
      throw new NotFoundException(`Writing with ID ${id} not found`);
    }
    return writing;
  }

  async update(id: string, updateWritingDto: UpdateWritingDto): Promise<Writing> {
    const writing = await this.findOne(id);
    await writing.update(updateWritingDto);
    return writing;
  }

  async remove(id: string): Promise<{ id: string; deleted: boolean }> {
    const writing = await this.findOne(id);
    await writing.destroy();
    return { id, deleted: true };
  }

  async findByLessonId(lessonId: string): Promise<Writing[]> {
    return await this.writingModel.findAll({
      where: {
        lessonId,
      },
    });
  }
}
