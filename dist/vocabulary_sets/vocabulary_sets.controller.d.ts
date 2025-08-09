import { VocabularySetsService } from './vocabulary_sets.service.js';
import { CreateVocabularySetDto } from './dto/create-vocabulary_set.dto.js';
import { UpdateVocabularySetDto } from './dto/update-vocabulary_set.dto.js';
export declare class VocabularySetsController {
    private readonly vocabularySetsService;
    constructor(vocabularySetsService: VocabularySetsService);
    create(createVocabularySetDto: CreateVocabularySetDto): Promise<import("./entities/vocabulary_set.entity.js").VocabularySet>;
    findAll(): Promise<import("./entities/vocabulary_set.entity.js").VocabularySet[]>;
    findByCourse(courseId: string): Promise<import("./entities/vocabulary_set.entity.js").VocabularySet[]>;
    findByLevel(level: string): Promise<import("./entities/vocabulary_set.entity.js").VocabularySet[]>;
    findByTopic(topic: string): Promise<import("./entities/vocabulary_set.entity.js").VocabularySet[]>;
    findOne(id: string): Promise<import("./entities/vocabulary_set.entity.js").VocabularySet>;
    update(id: string, updateVocabularySetDto: UpdateVocabularySetDto): Promise<import("./entities/vocabulary_set.entity.js").VocabularySet>;
    remove(id: string): Promise<void>;
}
