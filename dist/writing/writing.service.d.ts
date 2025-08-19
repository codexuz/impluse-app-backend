import { CreateWritingDto } from './dto/create-writing.dto.js';
import { UpdateWritingDto } from './dto/update-writing.dto.js';
import { Writing } from './entities/writing.entity.js';
export declare class WritingService {
    private writingModel;
    constructor(writingModel: typeof Writing);
    create(createWritingDto: CreateWritingDto): Promise<Writing>;
    findAll(): Promise<Writing[]>;
    findOne(id: string): Promise<Writing>;
    update(id: string, updateWritingDto: UpdateWritingDto): Promise<Writing>;
    remove(id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
    findByLessonId(lessonId: string): Promise<Writing[]>;
}
