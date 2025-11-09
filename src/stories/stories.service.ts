import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateStoryDto } from './dto/create-story.dto.js';
import { UpdateStoryDto } from './dto/update-story.dto.js';
import { Story } from './entities/story.entity.js';

@Injectable()
export class StoriesService {
  constructor(
    @InjectModel(Story)
    private storyModel: typeof Story,
  ) {}

  async create(createStoryDto: CreateStoryDto): Promise<Story> {
    // Initialize viewCount and likesCount to 0 and set default isPublished if not provided
    const story = await this.storyModel.create({
      ...createStoryDto,
      viewCount: 0,
      likesCount: 0,
      isPublished: createStoryDto.isPublished ?? false
    });
    
    return story;
  }

  async findAll(): Promise<Story[]> {
    // By default, only return published stories
    return this.storyModel.findAll({
      where: { isPublished: true },
      order: [['createdAt', 'DESC']]
    });
  }

  async findByType(type: 'video' | 'image'): Promise<Story[]> {
    // Return published stories of specific type
    return this.storyModel.findAll({
      where: { 
        isPublished: true,
        type: type
      },
      order: [['createdAt', 'DESC']]
    });
  }

  async findAllAdmin(): Promise<Story[]> {
    // For admin, return all stories including unpublished ones
    return this.storyModel.findAll({
      order: [['createdAt', 'DESC']]
    });
  }

  async findOne(id: string): Promise<Story> {
    const story = await this.storyModel.findOne({
      where: { id, isPublished: true }
    });

    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found or not published`);
    }

    // Increment view count and get updated story
    return this.incrementViewCount(id);
  }

  async findOneAdmin(id: string): Promise<Story> {
    const story = await this.storyModel.findByPk(id);

    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }

    return story;
  }

  async update(id: string, updateStoryDto: UpdateStoryDto): Promise<Story> {
    const story = await this.findOneAdmin(id);
    
    await story.update(updateStoryDto);
    
    return story;
  }

  async remove(id: string): Promise<void> {
    const story = await this.findOneAdmin(id);
    
    await story.destroy();
  }

  async publish(id: string): Promise<Story> {
    const story = await this.findOneAdmin(id);
    
    await story.update({ isPublished: true });
    
    return story;
  }

  async unpublish(id: string): Promise<Story> {
    const story = await this.findOneAdmin(id);
    
    await story.update({ isPublished: false });
    
    return story;
  }

  async incrementViewCount(id: string): Promise<Story> {
    const story = await this.storyModel.findByPk(id);
    
    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }
    
    await story.increment('viewCount');
    
    return story.reload();
  }

  async incrementLikesCount(id: string): Promise<Story> {
    const story = await this.storyModel.findByPk(id);
    
    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }
    
    await story.increment('likesCount');
    
    return story.reload();
  }

  async decrementLikesCount(id: string): Promise<Story> {
    const story = await this.storyModel.findByPk(id);
    
    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }

    if (story.likesCount > 0) {
      await story.decrement('likesCount');
    }
    
    return story.reload();
  }
}
