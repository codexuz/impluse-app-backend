import { Model } from "sequelize-typescript";
export declare class TypingExercise extends Model {
    id: string;
    question_id: string;
    correct_answer: string;
    is_case_sensitive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
