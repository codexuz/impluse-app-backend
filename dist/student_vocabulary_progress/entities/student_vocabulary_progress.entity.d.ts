import { Model } from "sequelize-typescript";
export declare class StudentVocabularyProgress extends Model {
    id: string;
    student_id: string;
    vocabulary_item_id: string;
    status: string;
    attempts_count: number;
    createdAt: Date;
    updatedAt: Date;
}
