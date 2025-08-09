import { LessonVocabularySet } from './entities/lesson_vocabulary_set.entity.js';
import { CreateLessonVocabularySetDto } from './dto/create-lesson-vocabulary-set.dto.js';
import { UpdateLessonVocabularySetDto } from './dto/update-lesson-vocabulary-set.dto.js';
export declare class LessonVocabularySetService {
    private lessonVocabularySetModel;
    constructor(lessonVocabularySetModel: typeof LessonVocabularySet);
    create(createLessonVocabularySetDto: CreateLessonVocabularySetDto): Promise<LessonVocabularySet>;
    createMany(createDtos: CreateLessonVocabularySetDto[]): Promise<LessonVocabularySet[]>;
    findAll(): Promise<LessonVocabularySet[]>;
    findOne(id: string): Promise<LessonVocabularySet>;
    findByLessonId(lesson_id: string): Promise<LessonVocabularySet[]>;
    findByVocabularyItemId(vocabulary_item_id: string): Promise<LessonVocabularySet[]>;
    update(id: string, updateLessonVocabularySetDto: UpdateLessonVocabularySetDto): Promise<LessonVocabularySet>;
    remove(id: string): Promise<void>;
    removeByLessonId(lesson_id: string): Promise<number>;
}
