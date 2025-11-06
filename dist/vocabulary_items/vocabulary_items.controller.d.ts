import { VocabularyItemsService } from './vocabulary_items.service.js';
import { CreateVocabularyItemDto } from './dto/create-vocabulary_item.dto.js';
import { UpdateVocabularyItemDto } from './dto/update-vocabulary_item.dto.js';
export declare class VocabularyItemsController {
    private readonly vocabularyItemsService;
    constructor(vocabularyItemsService: VocabularyItemsService);
    create(createVocabularyItemDto: CreateVocabularyItemDto): Promise<import("./entities/vocabulary_item.entity.js").VocabularyItem>;
    createMany(createVocabularyItemDtos: CreateVocabularyItemDto[]): Promise<import("./entities/vocabulary_item.entity.js").VocabularyItem[]>;
    findAll(): Promise<import("./entities/vocabulary_item.entity.js").VocabularyItem[]>;
    findBySetId(setId: string): Promise<import("./entities/vocabulary_item.entity.js").VocabularyItem[]>;
    findByWord(word: string): Promise<import("./entities/vocabulary_item.entity.js").VocabularyItem[]>;
    findOne(id: string): Promise<import("./entities/vocabulary_item.entity.js").VocabularyItem>;
    update(id: string, updateVocabularyItemDto: UpdateVocabularyItemDto): Promise<import("./entities/vocabulary_item.entity.js").VocabularyItem>;
    remove(id: string): Promise<void>;
    removeBySetId(setId: string): Promise<number>;
}
