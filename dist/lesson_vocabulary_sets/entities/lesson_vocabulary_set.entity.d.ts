import { Model } from 'sequelize-typescript';
export declare class LessonVocabularySet extends Model {
    id: string;
    lesson_id: string;
    vocabulary_item_id: string;
    createdAt: Date;
    updatedAt: Date;
}
