import { VocabularySet } from './entities/vocabulary_set.entity.js';
import { CreateVocabularySetDto } from './dto/create-vocabulary_set.dto.js';
import { UpdateVocabularySetDto } from './dto/update-vocabulary_set.dto.js';
export declare class VocabularySetsService {
    private vocabularySetModel;
    constructor(vocabularySetModel: typeof VocabularySet);
    create(createVocabularySetDto: CreateVocabularySetDto): Promise<VocabularySet>;
    findAll(): Promise<VocabularySet[]>;
    findOne(id: string): Promise<VocabularySet>;
    findByCourse(courseId: string): Promise<VocabularySet[]>;
    findByLevel(level: string): Promise<VocabularySet[]>;
    findByTopic(topic: string): Promise<VocabularySet[]>;
    update(id: string, updateVocabularySetDto: UpdateVocabularySetDto): Promise<VocabularySet>;
    remove(id: string): Promise<void>;
}
