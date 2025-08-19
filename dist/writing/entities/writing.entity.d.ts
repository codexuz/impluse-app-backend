import { Model } from "sequelize-typescript";
export declare class Writing extends Model {
    id: string;
    lessonId: string;
    question: string;
    instruction: string;
    sample_answer: string;
}
