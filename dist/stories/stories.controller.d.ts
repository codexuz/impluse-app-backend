import { StoriesService } from './stories.service.js';
import { CreateStoryDto } from './dto/create-story.dto.js';
import { UpdateStoryDto } from './dto/update-story.dto.js';
export declare class StoriesController {
    private readonly storiesService;
    constructor(storiesService: StoriesService);
    create(createStoryDto: CreateStoryDto): Promise<import("./entities/story.entity.js").Story>;
    findAll(): Promise<import("./entities/story.entity.js").Story[]>;
    findAllAdmin(): Promise<import("./entities/story.entity.js").Story[]>;
    findOne(id: string): Promise<import("./entities/story.entity.js").Story>;
    findOneAdmin(id: string): Promise<import("./entities/story.entity.js").Story>;
    update(id: string, updateStoryDto: UpdateStoryDto): Promise<import("./entities/story.entity.js").Story>;
    remove(id: string): Promise<void>;
    publish(id: string): Promise<import("./entities/story.entity.js").Story>;
    unpublish(id: string): Promise<import("./entities/story.entity.js").Story>;
    incrementViewCount(id: string): Promise<import("./entities/story.entity.js").Story>;
}
