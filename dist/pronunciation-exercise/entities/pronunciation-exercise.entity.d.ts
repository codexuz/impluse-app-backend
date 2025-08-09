import { Model } from 'sequelize-typescript';
export declare class PronunciationExercise extends Model {
    id: string;
    speaking_id: string;
    word_to_pronunce: string;
    audio_url: string;
}
