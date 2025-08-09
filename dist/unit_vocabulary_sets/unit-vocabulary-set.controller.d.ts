import { UnitVocabularySetService } from './unit-vocabulary-set.service.js';
import { CreateUnitVocabularySetDto } from './dto/create-unit_vocabulary_set.dto.js';
export declare class UnitVocabularySetController {
    private readonly unitVocabularySetService;
    constructor(unitVocabularySetService: UnitVocabularySetService);
    create(createUnitVocabularySetDto: CreateUnitVocabularySetDto): Promise<import("./entities/unit_vocabulary_set.entity.js").UnitVocabularySet>;
    createMany(createDtos: CreateUnitVocabularySetDto[]): Promise<import("./entities/unit_vocabulary_set.entity.js").UnitVocabularySet[]>;
    findAll(): Promise<import("./entities/unit_vocabulary_set.entity.js").UnitVocabularySet[]>;
    findByUnitId(unitId: string): Promise<import("./entities/unit_vocabulary_set.entity.js").UnitVocabularySet[]>;
    findOne(id: string): Promise<import("./entities/unit_vocabulary_set.entity.js").UnitVocabularySet>;
    remove(id: string): Promise<void>;
    removeByUnitId(unitId: string): Promise<number>;
    removeByVocabularyItemId(vocabularyItemId: string): Promise<number>;
}
