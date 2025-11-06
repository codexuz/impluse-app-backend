import { VocabularyItem } from './entities/vocabulary_item.entity.js';
import { CreateVocabularyItemDto } from './dto/create-vocabulary_item.dto.js';
import { UpdateVocabularyItemDto } from './dto/update-vocabulary_item.dto.js';
export declare class VocabularyItemsService {
    private vocabularyItemModel;
    constructor(vocabularyItemModel: typeof VocabularyItem);
    create(createVocabularyItemDto: CreateVocabularyItemDto): Promise<VocabularyItem>;
    createMany(createVocabularyItemDtos: CreateVocabularyItemDto[]): Promise<VocabularyItem[]>;
    findAll(): Promise<VocabularyItem[]>;
    findOne(id: string): Promise<VocabularyItem>;
    findBySetId(setId: string): Promise<VocabularyItem[]>;
    findByWord(word: string): Promise<VocabularyItem[]>;
    update(id: string, updateVocabularyItemDto: UpdateVocabularyItemDto): Promise<VocabularyItem>;
    remove(id: string): Promise<void>;
    removeBySetId(setId: string): Promise<number>;
}
