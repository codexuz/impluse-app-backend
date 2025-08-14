import { WritingService } from './writing.service.js';
import { CreateWritingDto } from './dto/create-writing.dto.js';
import { UpdateWritingDto } from './dto/update-writing.dto.js';
export declare class WritingController {
    private readonly writingService;
    constructor(writingService: WritingService);
    create(createWritingDto: CreateWritingDto): Promise<import("./entities/writing.entity.js").Writing>;
    findAll(): Promise<import("./entities/writing.entity.js").Writing[]>;
    findByLessonId(lessonId: string): Promise<import("./entities/writing.entity.js").Writing[]>;
    findOne(id: string): Promise<import("./entities/writing.entity.js").Writing>;
    update(id: string, updateWritingDto: UpdateWritingDto): Promise<import("./entities/writing.entity.js").Writing>;
    remove(id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
