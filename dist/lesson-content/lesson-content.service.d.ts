import { LessonContent } from './entities/lesson-content.entity.js';
import { CreateLessonContentDto } from './dto/create-lesson-content.dto.js';
import { UpdateLessonContentDto } from './dto/update-lesson-content.dto.js';
export declare class LessonContentService {
    private lessonContentModel;
    constructor(lessonContentModel: typeof LessonContent);
    create(createLessonContentDto: CreateLessonContentDto): Promise<LessonContent>;
    findAll(): Promise<LessonContent[]>;
    findOne(id: string): Promise<LessonContent>;
    findByLessonId(lessonId: string): Promise<LessonContent[]>;
    update(id: string, updateLessonContentDto: UpdateLessonContentDto): Promise<LessonContent>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
