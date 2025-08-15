import { LessonVocabularySetService } from './lesson_vocabulary_set.service.js';
import { CreateLessonVocabularySetDto } from './dto/create-lesson-vocabulary-set.dto.js';
import { UpdateLessonVocabularySetDto } from './dto/update-lesson-vocabulary-set.dto.js';
import { LessonVocabularySet } from './entities/lesson_vocabulary_set.entity.js';
export declare class LessonVocabularySetController {
    private readonly lessonVocabularySetService;
    constructor(lessonVocabularySetService: LessonVocabularySetService);
    create(createLessonVocabularySetDto: CreateLessonVocabularySetDto): Promise<LessonVocabularySet>;
    createMany(createLessonVocabularySetDtos: CreateLessonVocabularySetDto[]): Promise<LessonVocabularySet[]>;
    findAll(): Promise<LessonVocabularySet[]>;
    findOne(id: string): Promise<LessonVocabularySet>;
    findByLessonId(lesson_id: string): Promise<LessonVocabularySet[]>;
    findByVocabularyItemId(vocabulary_item_id: string): Promise<LessonVocabularySet[]>;
    update(id: string, updateLessonVocabularySetDto: UpdateLessonVocabularySetDto): Promise<LessonVocabularySet>;
    remove(id: string): Promise<void>;
    removeByLessonId(lesson_id: string): Promise<number>;
}
