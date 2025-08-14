import { CreateStoryDto } from './dto/create-story.dto.js';
import { UpdateStoryDto } from './dto/update-story.dto.js';
import { Story } from './entities/story.entity.js';
export declare class StoriesService {
    private storyModel;
    constructor(storyModel: typeof Story);
    create(createStoryDto: CreateStoryDto): Promise<Story>;
    findAll(): Promise<Story[]>;
    findAllAdmin(): Promise<Story[]>;
    findOne(id: string): Promise<Story>;
    findOneAdmin(id: string): Promise<Story>;
    update(id: string, updateStoryDto: UpdateStoryDto): Promise<Story>;
    remove(id: string): Promise<void>;
    publish(id: string): Promise<Story>;
    unpublish(id: string): Promise<Story>;
    incrementViewCount(id: string): Promise<Story>;
}
