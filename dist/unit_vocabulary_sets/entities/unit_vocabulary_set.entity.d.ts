import { Model } from 'sequelize-typescript';
export declare class UnitVocabularySet extends Model {
    id: string;
    unit_id: string;
    vocabulary_item_id: string;
    createdAt: Date;
    updatedAt: Date;
}
