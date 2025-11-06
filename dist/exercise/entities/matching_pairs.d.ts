import { Model } from "sequelize-typescript";
export declare class MatchingExercise extends Model {
    id: string;
    question_id: string;
    left_item: string;
    right_item: string;
    createdAt: Date;
    updatedAt: Date;
}
