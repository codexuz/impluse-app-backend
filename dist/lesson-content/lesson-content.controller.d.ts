import { LessonContentService } from './lesson-content.service.js';
import { CreateLessonContentDto } from './dto/create-lesson-content.dto.js';
import { UpdateLessonContentDto } from './dto/update-lesson-content.dto.js';
export declare class LessonContentController {
    private readonly lessonContentService;
    constructor(lessonContentService: LessonContentService);
    create(createLessonContentDto: CreateLessonContentDto): Promise<import("./entities/lesson-content.entity.js").LessonContent>;
    findAll(): Promise<import("./entities/lesson-content.entity.js").LessonContent[]>;
    findOne(id: string): Promise<import("./entities/lesson-content.entity.js").LessonContent>;
    findByLessonId(lessonId: string): Promise<import("./entities/lesson-content.entity.js").LessonContent[]>;
    update(id: string, updateLessonContentDto: UpdateLessonContentDto): Promise<import("./entities/lesson-content.entity.js").LessonContent>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
