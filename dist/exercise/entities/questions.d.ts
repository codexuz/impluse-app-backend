import { Model } from "sequelize-typescript";
export declare class Questions extends Model {
    id: string;
    exercise_id: string;
    question_type: string;
    question_text: string;
    points: number;
    order_number: number;
    sample_answer: string;
    createdAt: Date;
    updatedAt: Date;
}
