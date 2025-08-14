import { Model } from 'sequelize-typescript';
export declare class VocabularyItem extends Model {
    id: string;
    set_id: string;
    word: string;
    uzbek: string;
    rus: string;
    example: string;
    audio_url: string;
    image_url: string;
    createdAt: Date;
    updatedAt: Date;
}
