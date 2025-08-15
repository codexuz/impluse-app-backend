import { CreateUnitVocabularySetDto } from './dto/create-unit_vocabulary_set.dto.js';
import { UnitVocabularySet } from './entities/unit_vocabulary_set.entity.js';
export declare class UnitVocabularySetService {
    private unitVocabularySetModel;
    constructor(unitVocabularySetModel: typeof UnitVocabularySet);
    create(createUnitVocabularySetDto: CreateUnitVocabularySetDto): Promise<UnitVocabularySet>;
    createMany(createDtos: CreateUnitVocabularySetDto[]): Promise<UnitVocabularySet[]>;
    findAll(): Promise<UnitVocabularySet[]>;
    findByUnitId(unitId: string): Promise<UnitVocabularySet[]>;
    findOne(id: string): Promise<UnitVocabularySet>;
    remove(id: string): Promise<void>;
    removeByUnitId(unitId: string): Promise<number>;
    removeByVocabularyItemId(vocabularyItemId: string): Promise<number>;
}
